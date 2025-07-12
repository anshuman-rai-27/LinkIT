import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/jwt';
import prisma from "@/app/prisma";

async function getUserId(req: NextRequest): Promise<number | null> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return null;

  try {
    const decoded = verifyToken(token) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

async function isAdmin(userId: number): Promise<boolean> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: { role: true }
    });
    return profile?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type') || 'overview';
    const dateRange = searchParams.get('range') || '30';

    const days = parseInt(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let reportData: any = {};

    switch (reportType) {
      case 'user-activity':
        const [newUsers, activeUsers, totalUsers] = await Promise.all([
          prisma.user.count({
            where: { createdAt: { gte: startDate } }
          }),
          prisma.profile.count({
            where: { 
              OR: [
                { sentRequests: { some: { createdAt: { gte: startDate } } } },
                { receivedRequests: { some: { createdAt: { gte: startDate } } } }
              ]
            }
          }),
          prisma.user.count()
        ]);

        reportData = {
          newUsers,
          activeUsers,
          totalUsers,
          activityRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
        };
        break;

      case 'swap-stats':
        const [totalSwaps, acceptedSwaps, pendingSwaps, rejectedSwaps] = await Promise.all([
          prisma.swapRequest.count({
            where: { createdAt: { gte: startDate } }
          }),
          prisma.swapRequest.count({
            where: { 
              status: 'ACCEPTED',
              createdAt: { gte: startDate }
            }
          }),
          prisma.swapRequest.count({
            where: { 
              status: 'PENDING',
              createdAt: { gte: startDate }
            }
          }),
          prisma.swapRequest.count({
            where: { 
              status: 'REJECTED',
              createdAt: { gte: startDate }
            }
          })
        ]);

        reportData = {
          totalSwaps,
          acceptedSwaps,
          pendingSwaps,
          rejectedSwaps,
          successRate: totalSwaps > 0 ? Math.round((acceptedSwaps / totalSwaps) * 100) : 0
        };
        break;

      case 'feedback-logs':
        const feedbackStats = await prisma.feedback.groupBy({
          by: ['rating'],
          where: { createdAt: { gte: startDate } },
          _count: { rating: true }
        });

        const totalFeedbacks = feedbackStats.reduce((sum, stat) => sum + stat._count.rating, 0);
        const averageRating = feedbackStats.reduce((sum, stat) => sum + (stat.rating * stat._count.rating), 0) / totalFeedbacks;

        reportData = {
          totalFeedbacks,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution: feedbackStats
        };
        break;

      case 'moderation-actions':
        const moderationActions = await prisma.adminActionLog.groupBy({
          by: ['action'],
          where: { 
            createdAt: { gte: startDate },
            action: {
              in: ['USER_BANNED', 'USER_UNBANNED', 'USER_MADE_ADMIN', 'USER_ADMIN_REMOVED']
            }
          },
          _count: { action: true }
        });

        reportData = {
          totalActions: moderationActions.reduce((sum, action) => sum + action._count.action, 0),
          actionBreakdown: moderationActions
        };
        break;

      case 'platform-usage':
        const [totalSkills, popularSkills, totalProfiles] = await Promise.all([
          prisma.skill.count(),
          prisma.offeredSkill.groupBy({
            by: ['skillId'],
            _count: { skillId: true },
            orderBy: { _count: { skillId: 'desc' } },
            take: 10
          }),
          prisma.profile.count()
        ]);

        const popularSkillsWithNames = await Promise.all(
          popularSkills.map(async (skill) => {
            const skillName = await prisma.skill.findUnique({
              where: { id: skill.skillId },
              select: { name: true }
            });
            return {
              skillName: skillName?.name || 'Unknown',
              count: skill._count.skillId
            };
          })
        );

        reportData = {
          totalSkills,
          totalProfiles,
          popularSkills: popularSkillsWithNames
        };
        break;

      default:
        return NextResponse.json({ message: 'Invalid report type' }, { status: 400 });
    }

    return NextResponse.json({
      reportType,
      dateRange: days,
      data: reportData,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
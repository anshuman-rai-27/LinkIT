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

    // Get platform statistics
    const [
      totalUsers,
      totalProfiles,
      activeSwaps,
      pendingReviews,
      bannedUsers,
      totalSkills,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.profile.count(),
      prisma.swapRequest.count({
        where: { status: 'ACCEPTED' }
      }),
      prisma.swapRequest.count({
        where: { status: 'PENDING' }
      }),
      prisma.profile.count({
        where: { role: 'ADMIN' }
      }),
      prisma.skill.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: {
            select: { name: true }
          }
        }
      })
    ]);

    // Calculate success rate (accepted requests / total requests)
    const totalRequests = await prisma.swapRequest.count();
    const successRate = totalRequests > 0 ? (activeSwaps / totalRequests) * 100 : 0;

    // Get recent activity
    const recentSwaps = await prisma.swapRequest.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: {
        fromProfile: {
          select: { name: true }
        },
        toProfile: {
          select: { name: true }
        }
      }
    });

    const stats = {
      totalUsers,
      totalProfiles,
      activeSwaps,
      pendingReviews,
      bannedUsers,
      totalSkills,
      successRate: Math.round(successRate * 10) / 10,
      recentUsers: recentActivity,
      recentSwaps
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.adminActionLog.findMany({
        where: {
          action: {
            in: ['PLATFORM_MESSAGE_SENT', 'FEATURE_UPDATE', 'MAINTENANCE_NOTICE']
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.adminActionLog.count({
        where: {
          action: {
            in: ['PLATFORM_MESSAGE_SENT', 'FEATURE_UPDATE', 'MAINTENANCE_NOTICE']
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { messageType, message, targetUsers } = await req.json();

    if (!messageType || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Log the platform message
    await prisma.adminActionLog.create({
      data: {
        adminId: userId,
        action: 'PLATFORM_MESSAGE_SENT',
        targetUser: targetUsers ? parseInt(targetUsers) : null
      }
    });

    // In a real application, you would send this message to all users
    // For now, we'll just log it
    console.log(`Platform message sent by admin ${userId}:`, {
      type: messageType,
      message,
      targetUsers
    });

    return NextResponse.json({ 
      message: 'Platform message sent successfully',
      details: {
        type: messageType,
        message,
        targetUsers
      }
    });
  } catch (error) {
    console.error('Error sending platform message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
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
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }
    if (role) {
      whereClause.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.profile.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              verified: true
            }
          },
          offeredSkills: {
            include: { skill: true }
          },
          wantedSkills: {
            include: { skill: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.profile.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { profileId, action } = await req.json();

    if (!profileId || !action) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let updatedProfile;
    let adminAction = '';

    switch (action) {
      case 'ban':
        updatedProfile = await prisma.profile.update({
          where: { id: parseInt(profileId) },
          data: { role: 'USER' } // Reset to USER role (we don't have BANNED in schema)
        });
        adminAction = 'USER_BANNED';
        break;
      
      case 'unban':
        updatedProfile = await prisma.profile.update({
          where: { id: parseInt(profileId) },
          data: { role: 'USER' }
        });
        adminAction = 'USER_UNBANNED';
        break;
      
      case 'make_admin':
        updatedProfile = await prisma.profile.update({
          where: { id: parseInt(profileId) },
          data: { role: 'ADMIN' }
        });
        adminAction = 'USER_MADE_ADMIN';
        break;
      
      case 'remove_admin':
        updatedProfile = await prisma.profile.update({
          where: { id: parseInt(profileId) },
          data: { role: 'USER' }
        });
        adminAction = 'USER_ADMIN_REMOVED';
        break;
      
      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    // Log admin action
    await prisma.adminActionLog.create({
      data: {
        adminId: userId,
        action: adminAction,
        targetUser: parseInt(profileId)
      }
    });

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: updatedProfile
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
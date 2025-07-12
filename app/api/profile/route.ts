import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../prisma';
import { verifyToken } from '../../../lib/jwt';

// Helper to get userId from request (replace with real auth/session logic)
async function getUserId(req: NextRequest): Promise<number | null> {
  // Get token from Authorization header
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

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const profile = await prisma.profile.findFirst({
    where: { userId },
    include: {
      offeredSkills: true,
      wantedSkills: true,
    },
  });
  if (!profile) {
    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  }
  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user exists before creating profile
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  
  const data = await req.json();
  try {
    // Upsert profile (basic fields only)
    await prisma.profile.upsert({
      where: { userId },
      update: {
        name: data.name,
        location: data.location,
        profilePhoto: data.profilePhoto,
        availability: data.availability,
        isPublic: data.isPublic,
      },
      create: {
        userId,
        name: data.name,
        location: data.location,
        profilePhoto: data.profilePhoto,
        availability: data.availability,
        isPublic: data.isPublic,
      },
    });

    // Handle offeredSkills
    if (Array.isArray(data.offeredSkills)) {
      // Find or create all skills
      const offeredSkillRecords = await Promise.all(
        data.offeredSkills.map(async (name: string) => {
          let skill = await prisma.skill.findUnique({ where: { name } });
          if (!skill) {
            skill = await prisma.skill.create({ data: { name } });
          }
          return { id: skill.id };
        })
      );
      // Set offeredSkills relation
      await prisma.profile.update({
        where: { userId },
        data: {
          offeredSkills: {
            set: offeredSkillRecords.map(s => ({ id: s.id })),
          },
        },
      });
    }

    // Handle wantedSkills
    if (Array.isArray(data.wantedSkills)) {
      // Find or create all skills
      const wantedSkillRecords = await Promise.all(
        data.wantedSkills.map(async (name: string) => {
          let skill = await prisma.skill.findUnique({ where: { name } });
          if (!skill) {
            skill = await prisma.skill.create({ data: { name } });
          }
          return { id: skill.id };
        })
      );
      // Set wantedSkills relation
      await prisma.profile.update({
        where: { userId },
        data: {
          wantedSkills: {
            set: wantedSkillRecords.map(s => ({ id: s.id })),
          },
        },
      });
    }

    // Return updated profile
    const updatedProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        offeredSkills: true,
        wantedSkills: true,
      },
    });
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Profile update failed' }, { status: 500 });
  }
} 
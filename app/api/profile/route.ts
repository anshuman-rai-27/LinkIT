import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../prisma';

// Helper to get userId from request (replace with real auth/session logic)
async function getUserId(req: NextRequest): Promise<number | null> {
  // TODO: Replace with real authentication/session extraction
  // For now, assume userId=1 for demo
  return 1;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const profile = await prisma.profile.findUnique({
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
  const data = await req.json();
  try {
    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        name: data.name,
        location: data.location,
        profilePhoto: data.profilePhoto,
        availability: data.availability,
        isPublic: data.isPublic,
        // Skills handled separately below
      },
      create: {
        userId,
        name: data.name,
        location: data.location,
        profilePhoto: data.profilePhoto,
        availability: data.availability,
        isPublic: data.isPublic,
      },
      include: {
        offeredSkills: true,
        wantedSkills: true,
      },
    });

    // Update skills (replace all for simplicity)
    if (Array.isArray(data.offeredSkills)) {
      await prisma.profile.update({
        where: { userId },
        data: {
          offeredSkills: {
            set: [],
            connectOrCreate: data.offeredSkills.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        },
      });
    }
    if (Array.isArray(data.wantedSkills)) {
      await prisma.profile.update({
        where: { userId },
        data: {
          wantedSkills: {
            set: [],
            connectOrCreate: data.wantedSkills.map((name: string) => ({
              where: { name },
              create: { name },
            })),
          },
        },
      });
    }

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
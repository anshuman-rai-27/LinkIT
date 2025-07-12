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
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      offeredSkills: {
        include: {
          skill: true
        }
      },
      wantedSkills: {
        include: {
          skill: true
        }
      }
    }
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
    const profile = await prisma.profile.upsert({
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
      // Clear existing offered skills
      await prisma.offeredSkill.deleteMany({
        where: { profileId: profile.id }
      });

      // Add new offered skills
      for (const skillName of data.offeredSkills) {
        // Find or create skill
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName } });
        }

        // Create offered skill relation
        await prisma.offeredSkill.create({
          data: {
            profileId: profile.id,
            skillId: skill.id
          }
        });
      }
    }

    // Handle wantedSkills
    if (Array.isArray(data.wantedSkills)) {
      // Clear existing wanted skills
      await prisma.wantedSkill.deleteMany({
        where: { profileId: profile.id }
      });

      // Add new wanted skills
      for (const skillName of data.wantedSkills) {
        // Find or create skill
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName } });
        }

        // Create wanted skill relation
        await prisma.wantedSkill.create({
          data: {
            profileId: profile.id,
            skillId: skill.id
          }
        });
      }
    }

    // Return updated profile with skills
    const updatedProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        offeredSkills: {
          include: {
            skill: true
          }
        },
        wantedSkills: {
          include: {
            skill: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Profile update failed' }, { status: 500 });
  }
} 
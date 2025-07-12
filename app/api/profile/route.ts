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
  const profile = await prisma.$queryRaw`
  SELECT
  p.id AS profile_id,
  p.name,
  p.location,
  p."profilePhoto",
  p.availability,
  p."isPublic",
  p.role,
  p."createdAt",
  p."userId",
  COALESCE(AVG(f.rating), 0) AS rating,
  json_agg(DISTINCT jsonb_build_object('id', os.id, 'name', s1.name, 'category', s1.category)) AS offered_skills,
  json_agg(DISTINCT jsonb_build_object('id', ws.id, 'name', s2.name, 'category', s2.category)) AS wanted_skills
FROM "Profile" p
LEFT JOIN "Feedback" f ON f."toProfileId" = p.id
LEFT JOIN "OfferedSkill" os ON os."profileId" = p.id
LEFT JOIN "Skill" s1 ON os."skillId" = s1.id
LEFT JOIN "WantedSkill" ws ON ws."profileId" = p.id
LEFT JOIN "Skill" s2 ON ws."skillId" = s2.id
GROUP BY p.id;

  `;
  

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
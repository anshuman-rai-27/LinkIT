import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/prisma';
import { verifyToken } from '@/lib/jwt';

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
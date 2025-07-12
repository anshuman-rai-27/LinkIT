import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../prisma';

export async function GET(req: NextRequest) {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        isPublic: true // Only get public profiles
      },
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
        },
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 profiles for performance
    });

    // Transform the data to match the frontend expectations
    const transformedProfiles = profiles.map((profile, index) => ({
      id: profile.id.toString(),
      name: profile.name || `User ${profile.id}`,
      avatarUrl: profile.profilePhoto || "",
      initials: profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
      borderColor: `border-${['orange', 'purple', 'red', 'blue', 'green'][index % 5]}-400`,
      location: profile.location || "Unknown",
      yearsExperience: "3+ years experience", // Default since not in schema
      skillsOffered: profile.offeredSkills.map(os => os.skill.name),
      skillsNeeded: profile.wantedSkills.map(ws => ws.skill.name),
      rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
      email: profile.user.email
    }));

    return NextResponse.json(transformedProfiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    // Return empty array instead of error to prevent frontend crash
    return NextResponse.json([]);
  }
} 
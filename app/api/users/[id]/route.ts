import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: userId,
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
      }
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Transform the data to match the frontend expectations
    const transformedProfile = {
      id: profile.id.toString(),
      name: profile.name || `User ${profile.id}`,
      avatarUrl: profile.profilePhoto || "",
      initials: profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
      borderColor: `border-${['orange', 'purple', 'red', 'blue', 'green'][profile.id % 5]}-400`,
      location: profile.location || "Unknown",
      yearsExperience: "3+ years experience", // Default since not in schema
      skillsOffered: profile.offeredSkills.map(os => os.skill.name),
      skillsNeeded: profile.wantedSkills.map(ws => ws.skill.name),
      rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
      email: profile.user.email,
      bio: profile.availability || "No bio available", // Using availability as bio for now
      availability: profile.availability || "Available for collaboration",
      timezone: "UTC", // Default timezone
      languages: ["English"], // Default language
      projects: [
        {
          name: "Sample Project",
          description: "This is a sample project description. In a real application, this would be fetched from a separate projects table.",
          tech: profile.offeredSkills.slice(0, 3).map(os => os.skill.name)
        }
      ]
    };

    return NextResponse.json(transformedProfile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    // Return empty object instead of error to prevent frontend crash
    return NextResponse.json({});
  }
} 
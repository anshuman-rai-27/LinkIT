import {NextRequest, NextResponse} from "next/server";
import { verifyToken } from '../../../lib/jwt';
import prisma from "@/app/prisma";

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


export async function GET(req: NextRequest){
    try {
        console.log("Fetching requests");
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const profile = await prisma.profile.findFirst({
            where:{
                userId:userId
            },
        });

        if (!profile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        const swapRequests = await prisma.swapRequest.findMany({
            where:{
                OR:[
                    {fromProfileId:profile.id},
                    {toProfileId:profile.id},
                ]
            }, 
            include:{
                fromProfile: {
                    include: {
                        user: {
                            select: { email: true }
                        },
                        offeredSkills: {
                            include: { skill: true }
                        },
                        wantedSkills: {
                            include: { skill: true }
                        }
                    }
                },
                toProfile: {
                    include: {
                        user: {
                            select: { email: true }
                        },
                        offeredSkills: {
                            include: { skill: true }
                        },
                        wantedSkills: {
                            include: { skill: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform the data to match frontend expectations
        const transformedRequests = swapRequests.map((request) => {
            const isIncoming = request.toProfileId === profile.id;
            const otherProfile = isIncoming ? request.fromProfile : request.toProfile;
            
            return {
                id: request.id,
                user: {
                    id: otherProfile.id.toString(),
                    name: otherProfile.name || `User ${otherProfile.id}`,
                    avatarUrl: otherProfile.profilePhoto || "",
                    initials: otherProfile.name ? otherProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
                    borderColor: `border-${['orange', 'purple', 'red', 'blue', 'green', 'yellow', 'pink', 'indigo', 'teal', 'cyan', 'rose'][otherProfile.id % 11]}-400`,
                    location: otherProfile.location || "Unknown",
                    yearsExperience: "3+ years experience", // Default since not in schema
                    skillsOffered: otherProfile.offeredSkills.map(os => os.skill.name),
                    skillsNeeded: otherProfile.wantedSkills.map(ws => ws.skill.name),
                    rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
                    email: otherProfile.user.email
                },
                status: request.status.toLowerCase(),
                message: (request as any).message,
                offeredSkill: (request as any).offeredSkill,
                requestedSkill: (request as any).requestedSkill,
                requestedAt: request.createdAt,
                isIncoming: isIncoming
            };
        });

        console.log(`Found ${transformedRequests.length} requests`);
        return NextResponse.json(transformedRequests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}


export async function POST(req:NextRequest){
    try {
        console.log('Request received');
        const userId = await getUserId(req);
        console.log('User ID:', userId);

        if (!userId) {
            console.log('Unauthorized - no user ID');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        
        const profile = await prisma.profile.findFirst({
            where:{
                userId,
            }
        });

        if (!profile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        let data;
        try {
            data = await req.json();
            console.log('Request data:', data);
        } catch (parseError) {
            console.error('Error parsing request JSON:', parseError);
            return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
        }

        if (!data || typeof data !== 'object') {
            console.error('Invalid data format:', data);
            return NextResponse.json({ message: 'Invalid request data format' }, { status: 400 });
        }

        const { profileId, offeredSkill, requestedSkill, message } = data;

        if (!profileId || !offeredSkill || !requestedSkill || !message) {
            console.log('Missing required fields:', { profileId, offeredSkill, requestedSkill, message });
            return NextResponse.json({ message: 'Bad Request: Missing required fields' }, { status: 400 });
        }

        // Validate that the target profile exists
        const targetProfile = await prisma.profile.findUnique({
            where: { id: parseInt(profileId) }
        });

        if (!targetProfile) {
            return NextResponse.json({ message: 'Target profile not found' }, { status: 404 });
        }

        const swapRequestData = {
            fromProfileId: profile.id,
            toProfileId: parseInt(profileId),
            offeredSkill,
            requestedSkill,
            message,
        };
        
        console.log('Creating swap request with data:', swapRequestData);
        
        await prisma.swapRequest.create({
            data: swapRequestData as any
        });
        
        return NextResponse.json({message:"Request sent successfully"}, {status:201});
    } catch (error) {
        console.error('Error creating swap request:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
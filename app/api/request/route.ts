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
    console.log("life")
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    const profile = await prisma.profile.findFirst({
        where:{
            userId:userId
        },
    })

    const swapRequest = await prisma.swapRequest.findMany({
        where:{
            OR:[
                {fromProfileId:profile?.id},
                {toProfileId:profile?.id},
            ]
        }, 
        include:{
            fromProfile:true,
            toProfile:true,
        }
    })

    return NextResponse.json(swapRequest);
}


export async function POST(req:NextRequest){
    const userId = await getUserId(req);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const profile = await prisma.profile.findFirst({
        where:{
            userId,
        }
    })
    const data = await req.json();

    const { profileId, offeredSkill, requestedSkill, message } = data;

    if (!profileId || !offeredSkill || !requestedSkill || !message) {
        return NextResponse.json({ message: 'Bad Request: Missing required fields' }, { status: 400 });
    }

    await prisma.swapRequest.create({
        data:{
            fromProfileId:profile!.id,
            toProfileId:profileId,
            offeredSkill,
            requestedSkill,
            message,
        }
    })
    return NextResponse.json({message:"Request sent successfully"}, {status:201});
}
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/app/prisma";
import { verifyToken } from '@/lib/jwt';

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

export async function POST(req:NextRequest){
    const userId = await getUserId(req);
    const data = await req.json();
    const {profileId, comment, rating} = data;
    const profile = await prisma.profile.findUnique({where:{userId:userId!}})
    if(!profile){
        return NextResponse.json({message:"Not found"}, {status:404})
    }

    await prisma.feedback.create({
        data:{
            fromProfileId:profile!.id,
            toProfileId:profileId,
            comment:comment,
            rating:rating
        }
    })

    return NextResponse.json({message:"Feedback sent successfully"}, {status:201});

}
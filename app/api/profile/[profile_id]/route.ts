import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma"
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

export async function GET(req:NextRequest, {params}:{params:Promise<{profile_id:string}>}){
    const userId = await getUserId(req);
    const {profile_id} = await params;
    const profile = await prisma.profile.findUnique({where:{id:parseInt(profile_id)},include:{
        feedbacksReceived:true,
        wantedSkills:true,
        offeredSkills:true
    }})
    if(!profile){
        return NextResponse.json({message:"Not found"}, {status:404})
    }

    return NextResponse.json(profile)
}
import {NextRequest, NextResponse} from "next/server"
import { jwtVerify } from 'jose';
import prisma from "@/app/prisma";
async function getUserId(req: NextRequest):Promise<number | null> {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;
    try {
      const { payload: { id } } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      return id as number;
    } catch {
      return null;
    }
  }

export async function GET(req:NextRequest, {params}:{params:Promise<{skill_id:string}>}){
    
    const {skill_id} = await params


    const skill = await prisma.skill.findUnique({where:{id:parseInt(skill_id)}})


    if(!skill){
        return NextResponse.json({message:"Not found"}, {status:404})
    }

    return NextResponse.json(skill)
}
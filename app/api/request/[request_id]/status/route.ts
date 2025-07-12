import {NextRequest, NextResponse} from "next/server"
import { verifyToken } from '@/lib/jwt';
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

export async function PATCH(req:NextRequest, {params}:{params:Promise<{request_id:string}>}){
    const userId = await getUserId(req);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    const profile = await prisma.profile.findFirst({
        where:{
            userId:userId
        },
    })

    const {request_id} = await params;
    const {status} = await req.json();
    if(!status){
      return NextResponse.json({ message: 'Bad Request: Missing required fields' }, { status: 400 });
    }
    await prisma.swapRequest.update({
        where:{id:parseInt(request_id)},
        data:{status}
    })
    return NextResponse.json({status:204});
}
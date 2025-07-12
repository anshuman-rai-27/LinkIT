import { NextResponse } from 'next/server';
import prisma from '../../../prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ message: 'Token is not provided' }, { status: 400 });
  }

  const resetPassword = await prisma.resetPasswordToken.findUnique({
    where:{
      token:token
    },
    include:{
      User:true
    }  
  })
  
  
  if(!resetPassword){
    return NextResponse.json({ message: 'Token is not valid' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: resetPassword.User.email } });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
  await prisma.resetPasswordToken.delete({
    where:{
        id:resetPassword.id
    }
  })

  await prisma.user.update({
    where:{
        email:user.email
    },
    data:{
        verified:true
    }
  })
  return NextResponse.json({
    message: 'User registered',
    user: { id: user.id, email: user.email },
    token,
  }, { status: 201 });
  
} 

import { NextResponse } from 'next/server';
import prisma from '../../../prisma';
import { signToken } from '@/lib/jwt';

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
      user:true
    }  
  })
  
  
  if(!resetPassword){
    return NextResponse.json({ message: 'Token is not valid' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: resetPassword.user.email } });
  if (!user) {
    return NextResponse.json({ message: 'user not found' }, { status: 404 });
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

  const testToken = await signToken({ userId: user.id, email: user.email }, {
    expiresIn: '1d'
  });
  return NextResponse.json({
    message: 'User registered',
    user: { id: user.id, email: user.email },
    token:testToken,
  }, { status: 201 });
  
} 

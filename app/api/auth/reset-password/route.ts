import { NextResponse } from 'next/server';
import prisma from '@/app/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const { resetToken, password } = await req.json();
  if (!resetToken) {
    return NextResponse.json({ message: 'Token is not provided' }, { status: 400 });
  }
  if (!password){
    return NextResponse.json({message:'Password is not provided'},{status:400})
  }
  const resetPassword = await prisma.resetPasswordToken.findUnique({
    where:{
      token:resetToken
    },
    include:{
      user:true
    }  
  })
  
  
  if(!resetPassword){
    return NextResponse.json({ message: 'Token is not valid' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where:{
        email:resetPassword.user.email
    },
    data:{
        password:hashedPassword
    }
  })
//   if (!user) {
//     return NextResponse.json({ message: 'User not found' }, { status: 404 });
//   }
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
  const token = signToken({ userId: user.id, email: user.email }, {
    expiresIn: '1d'
  });
  return NextResponse.json({
    message: 'User registered',
    user: { id: user.id, email: user.email },
    token
  }, { status: 201 });
} 
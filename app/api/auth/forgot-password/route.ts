import { NextResponse } from 'next/server';
import prisma from '../../../prisma';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mail';
import { BACKEND_URL } from '@/lib/constant';

export async function POST(req: Request) {
  const { email} = await req.json();
  if (!email) {
    return NextResponse.json({ message: 'Email are required' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    return NextResponse.json({ message: `User doesn't exists` }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(email, 10);
  await prisma.resetPasswordToken.create({
    data:{
        userId: existingUser.id,
        token:hashedPassword,
        expires: new Date(Date.now() + 3600000) //1 hour
    }
  })
  await sendMail(
    email, 
    'Forgot Password', 
    `Click <a href="${BACKEND_URL}/reset-password?token=${hashedPassword}">here</a> to reset your password`
  )

  // const token = signToken({ userId: user.id, email: user.email });
  return NextResponse.json({
    message: 'Email sent successfully',
  }, { status: 201 });

} 
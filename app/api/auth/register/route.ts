import { NextResponse } from 'next/server';
import prisma from '../../../prisma';
// @ts-ignore
import bcrypt from 'bcryptjs';
import { signToken } from '../../../../lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return NextResponse.json({
    message: 'User registered',
    user: { id: user.id, email: user.email },
    token,
  }, { status: 201 });
} 
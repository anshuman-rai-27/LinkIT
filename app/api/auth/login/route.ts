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

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ userId: user.id, email: user.email });
  return NextResponse.json({ token });
} 
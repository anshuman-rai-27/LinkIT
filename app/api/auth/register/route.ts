import { NextResponse } from 'next/server';
import prisma from '../../../prisma';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mail';
import { BACKEND_URL } from '@/lib/constant';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
  
    const hashedEmail = await bcrypt.hash(email, 10);
  
    await prisma.resetPasswordToken.create({
      data: {
        userId: user.id,
        token: hashedEmail,
        expires: new Date(Date.now() + 3600000) //1 hour
      }
    })
  
    await sendMail(
      email, 
      'Verify your email', 
      `Click <a href="${BACKEND_URL}/verify?token=${hashedEmail}">here</a> to verify your email`
    )
    return NextResponse.json({
      message:"User created", 
    }, {status:201})

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database connection errors
    if (error instanceof Error) {
      if (error.message.includes('connect') || error.message.includes('database')) {
        return NextResponse.json({ 
          message: 'Database connection error. Please try again later.' 
        }, { status: 503 });
      }
    }
    
    return NextResponse.json({ 
      message: 'Internal server error. Please try again.' 
    }, { status: 500 });
  }
} 
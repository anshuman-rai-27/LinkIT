import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../prisma';

export async function GET(req: NextRequest) {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ message: 'Failed to fetch skills' }, { status: 500 });
  }
} 
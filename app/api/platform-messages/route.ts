import { NextRequest, NextResponse } from "next/server";
import prisma from "../../prisma";
import { verifyToken } from "../../../lib/jwt";

// In-memory storage for platform messages (temporary until database is ready)
let platformMessages: any[] = [];

export async function GET() {
  try {
    console.log('Fetching platform messages, count:', platformMessages.length);
    return NextResponse.json({ messages: platformMessages });
  } catch (error) {
    console.error('Error fetching platform messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const profile = await prisma.profile.findUnique({
      where: { userId: decoded.userId },
      select: { role: true, id: true, name: true }
    });

    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create new message and add to in-memory storage
    const newMessage = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString(),
      admin: {
        name: profile.name || "Admin",
        user: {
          email: "admin@linkit.com"
        }
      }
    };

    // Add to the beginning of the array (most recent first)
    platformMessages.unshift(newMessage);
    
    console.log('Created new platform message:', newMessage);
    console.log('Total messages now:', platformMessages.length);

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error('Error creating platform message:', error);
    return NextResponse.json(
      { error: 'Failed to create platform message' },
      { status: 500 }
    );
  }
} 
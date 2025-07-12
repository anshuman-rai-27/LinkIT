import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/jwt';
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

export async function POST(req: NextRequest) {
  try {
    console.log('Feedback request received');
    const userId = await getUserId(req);
    console.log('User ID:', userId);

    if (!userId) {
      console.log('Unauthorized - no user ID');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findFirst({
      where: {
        userId,
      }
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    let data;
    try {
      data = await req.json();
      console.log('Feedback data:', data);
    } catch (parseError) {
      console.error('Error parsing feedback JSON:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!data || typeof data !== 'object') {
      console.error('Invalid data format:', data);
      return NextResponse.json({ message: 'Invalid request data format' }, { status: 400 });
    }

    const { toProfileId, rating, comment } = data;

    if (!toProfileId || !rating || !comment) {
      console.log('Missing required fields:', { toProfileId, rating, comment });
      return NextResponse.json({ message: 'Bad Request: Missing required fields' }, { status: 400 });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Validate that the target profile exists
    const targetProfile = await prisma.profile.findUnique({
      where: { id: parseInt(toProfileId) }
    });

    if (!targetProfile) {
      return NextResponse.json({ message: 'Target profile not found' }, { status: 404 });
    }

    // Prevent self-rating
    if (profile.id === parseInt(toProfileId)) {
      return NextResponse.json({ message: 'You cannot rate yourself' }, { status: 400 });
    }

    // Check if user has already rated this profile
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        fromProfileId: profile.id,
        toProfileId: parseInt(toProfileId)
      }
    });

    if (existingFeedback) {
      return NextResponse.json({ message: 'You have already rated this user' }, { status: 400 });
    }

    const feedbackData = {
      fromProfileId: profile.id,
      toProfileId: parseInt(toProfileId),
      rating: parseInt(rating),
      comment: comment.trim()
    };

    console.log('Creating feedback with data:', feedbackData);

    await prisma.feedback.create({
      data: feedbackData
    });

    return NextResponse.json({ message: "Feedback submitted successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
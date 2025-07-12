import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/jwt';
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('Update request status received');
    const userId = await getUserId(req);
    console.log('User ID:', userId);

    if (!userId) {
      console.log('Unauthorized - no user ID');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id);
    
    if (isNaN(requestId)) {
      return NextResponse.json({ message: 'Invalid request ID' }, { status: 400 });
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
      console.log('Update data:', data);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return NextResponse.json({ message: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { status } = data;

    if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status. Must be ACCEPTED, REJECTED, or CANCELLED' }, { status: 400 });
    }

    // Find the request
    const swapRequest = await prisma.swapRequest.findUnique({
      where: { id: requestId },
      include: {
        fromProfile: true,
        toProfile: true
      }
    });

    if (!swapRequest) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 });
    }

    // Check if user has permission to update this request
    // User can only update requests they sent (to cancel) or received (to accept/reject)
    const isSender = swapRequest.fromProfileId === profile.id;
    const isReceiver = swapRequest.toProfileId === profile.id;

    if (!isSender && !isReceiver) {
      return NextResponse.json({ message: 'You do not have permission to update this request' }, { status: 403 });
    }

    // Validate status transitions
    if (swapRequest.status !== 'PENDING') {
      return NextResponse.json({ message: 'Request is not in pending status' }, { status: 400 });
    }

    // Only sender can cancel, only receiver can accept/reject
    if (status === 'CANCELLED' && !isSender) {
      return NextResponse.json({ message: 'Only the sender can cancel a request' }, { status: 403 });
    }

    if ((status === 'ACCEPTED' || status === 'REJECTED') && !isReceiver) {
      return NextResponse.json({ message: 'Only the receiver can accept or reject a request' }, { status: 403 });
    }

    // Update the request status
    const updatedRequest = await prisma.swapRequest.update({
      where: { id: requestId },
      data: { status },
      include: {
        fromProfile: {
          include: {
            user: {
              select: { email: true }
            }
          }
        },
        toProfile: {
          include: {
            user: {
              select: { email: true }
            }
          }
        }
      }
    });

    console.log('Request updated successfully:', updatedRequest);

    return NextResponse.json({ 
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error updating request status:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 
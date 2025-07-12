import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// List of routes that do NOT require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/register',
  // add more as needed
];

function isPublic(path: string) {
  return PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    // Match all routes except for static files and public paths
    '/((?!_next/static|_next/image|favicon.ico|api/auth|login|signup).*)',
  ],
}; 
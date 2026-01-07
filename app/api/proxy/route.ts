import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.JWT_SECRET
);

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If accessing protected route without token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If token exists, verify it
  if (token) {
    try {
      await jwtVerify(token, secret);

      // If on auth route with valid token, redirect to dashboard
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard/client', request.url));
      }
    } catch (err) {
      // Token is invalid
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const isAdmin = request.cookies.get('is-admin')?.value === 'true';

  // Admin routes that require admin authentication
  const adminRoutes = [
    '/admin/service-submissions',
    '/admin/service-submissions/[id]',
    '/admin/dashboard',
    '/admin/users',
    '/admin/forms',
    '/admin/contacts',
  ];

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If trying to access an admin route without a token or without admin privileges, redirect to auth page
  if (isAdminRoute && (!token || !isAdmin)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access auth page with a token and admin privileges, redirect to admin dashboard
  if (pathname === '/' && token && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth',
    '/',
  ],
};
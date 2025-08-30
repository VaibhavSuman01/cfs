import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/new-form",
    "/dashboard/forms",
    "/dashboard/roc-returns-form",
    "/dashboard/roc-returns",
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If trying to access a protected route without a token, redirect to auth page
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // If trying to access auth page with a token, redirect to dashboard
  if (pathname === "/auth" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/auth", "/"],
};

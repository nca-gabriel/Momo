import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  const publicPaths = ["/login", "/signup"];
  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Protect all other pages and API routes
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // exclude static assets
  ],
};

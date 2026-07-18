import { NextRequest, NextResponse } from "next/server";
import { getUserData } from "./app/lib/cookie";

const publicPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

const adminPaths = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read auth_token directly from request cookies
  const token = req.cookies.get("auth_token")?.value;

  // Read user_data from Next.js cookie
  const user = token ? await getUserData() : null;

  const isPublicPath = publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  const isAdminPath = adminPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Not logged in
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Admin authorization
  if (token && user) {
    if (isAdminPath && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Already logged in
  if (token && user && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
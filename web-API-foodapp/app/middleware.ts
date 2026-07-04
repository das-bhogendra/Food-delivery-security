import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const isAuth = !!token;

  if (!isAuth && (req.nextUrl.pathname.startsWith('/user/dashboard') || req.nextUrl.pathname.startsWith('/admin/dashboard'))) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

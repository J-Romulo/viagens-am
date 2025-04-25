import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/home', '/', '/settings'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  if (path === '/') {
    return NextResponse.redirect(new URL('/home', req.nextUrl));
  }

  const token = (await cookies()).get('token')?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/signIn', req.nextUrl));
  }

  return NextResponse.next();
}

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/signIn', '/signUp'];

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  if (path === '/') {
    return NextResponse.redirect(new URL('/home', req.nextUrl));
  }

  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signIn', req.nextUrl));
  }

  return NextResponse.next();
}

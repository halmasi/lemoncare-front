import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', req.url);
    console.log('Done ! : ' + token);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

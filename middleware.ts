import { NextResponse, NextRequest } from 'next/server';
import { loginCheck } from './app/utils/actions/actionMethods';

export async function middleware(req: NextRequest) {
  const loginUrl = new URL(`/login`, req.url);
  const dashboardUrl = new URL('/dashboard', req.url);
  const cookieToken = req.cookies.get('jwt');
  if (req.nextUrl.pathname === '/login') {
    if (
      cookieToken &&
      cookieToken.value &&
      (await loginCheck(cookieToken.value)).status === 200
    ) {
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  if (
    !cookieToken ||
    !cookieToken.value ||
    (await loginCheck(cookieToken.value)).status !== 200
  ) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};

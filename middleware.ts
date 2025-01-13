import { NextResponse } from 'next/server';

export async function middleware() {
  console.log('runnig midleware');
  NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };

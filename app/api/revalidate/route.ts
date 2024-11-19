import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log(request.headers);
  //   const res = request.cookies.get("token")?.value;
  //   console.log(res);
  return new Response(request.body);
}

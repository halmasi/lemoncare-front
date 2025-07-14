import { requestData } from '@/app/utils/data/dataFetch';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      location = 'phone',
      code,
    }: {
      username: string;
      jwt: string;
      location?: 'email' | 'phone';
      code: number;
    } = await request.json();

    const res = await requestData({
      qs: `/auth/otp-login`,
      method: 'POST',
      body: {
        user: { username },
        code,
        location,
      },
    });
    // const result = res.data
    if (res.data.jwt) {
      const res = await requestData({
        qs: `/auth/otp-login`,
        method: 'POST',
        body: {
          user: { username },
          code,
          location,
        },
      });
    }
    return Response.json(
      JSON.stringify({
        jwt: res.data.jwt,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json({ error: 'error' + err }, { status: 200 });
  }
}

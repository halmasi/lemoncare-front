import { NextRequest, NextResponse } from 'next/server';
import { requestData } from '@/app/utils/data/dataFetch';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accessToken = url.hash.split('=')[1]?.split('&')[0];

  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token found' },
      { status: 400 }
    );
  }

  try {
    const googleUserRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const googleUser = await googleUserRes.json();

    if (!googleUser.email) {
      return NextResponse.json(
        { error: 'Google user data is invalid' },
        { status: 400 }
      );
    }

    const strapiResponse = await requestData('/auth/google/callback', 'POST', {
      email: googleUser.email,
      username: googleUser.name,
      provider: 'google',
      access_token: accessToken,
    });

    if (strapiResponse.data.error) {
      return NextResponse.json(
        { error: strapiResponse.data.error.message },
        { status: 400 }
      );
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': `jwt=${strapiResponse.data.jwt}; Path=/; HttpOnly;`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to authenticate with Google' },
      { status: 500 }
    );
  }
}

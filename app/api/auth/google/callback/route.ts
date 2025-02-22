import { setCookie } from '@/app/utils/actions/actionMethods';
import { requestData } from '@/app/utils/data/dataFetch';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code found' },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 }
      );
    }

    const googleUserRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',

      {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const googleUser = await googleUserRes.json();

    if (!googleUser.email) {
      return NextResponse.json(
        { error: 'Invalid Google user data' },
        { status: 400 }
      );
    }

    const strapiResponse = await requestData(
      `/auth/google/callback?access_token=${tokenData.access_token}`,
      'GET',
      {}
    );

    const strapiData = await strapiResponse.data;

    if (strapiResponse && strapiResponse.data.user) {
      const { jwt, user } = strapiData;

      // Update user profile with additional data
      await requestData(
        `/users/${user.id}`,
        'PUT',
        {
          email: googleUser.email,
          fullName: googleUser.name,
          provider: 'google',
          username: '000000000000',
        },
        `${jwt}`
      );
      // Set JWT in cookies and redirect
      await setCookie('jwt', `Bearer ${jwt}`);

      // Redirect and trigger a client-side reload to ensure the middleware picks up the new cookie
      const response = NextResponse.redirect(new URL('/dashboard', req.url));

      response.headers.set(
        'Set-Cookie',
        `jwt=Bearer ${jwt}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
      );
      response.headers.set('Refresh', '0; url=/dashboard');

      return response;
    }
    if (strapiData.error) {
      return NextResponse.json(
        { error: strapiData.error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.json(
      { error: 'Google authentication failed 202' },
      { status: 500 }
    );
  }
}

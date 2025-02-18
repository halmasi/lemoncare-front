import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  console.log('Redirect URI:', process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI);

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
    console.log('Google Token Response :', tokenData);
    console.log('Google Token Response2 :', tokenResponse);
    if (!tokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 }
      );
    }

    // Fetch Google user data
    const googleUserRes = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',

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

    // Send user data to Strapi for authentication
    const strapiResponse = await fetch(
      `${process.env.BACKEND_PATH}/auth/google/callback`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleUser.email,
          username: googleUser.name,
          provider: 'google',
          access_token: tokenData.access_token,
        }),
      }
    );

    const strapiData = await strapiResponse.json();

    if (strapiData.error) {
      return NextResponse.json(
        { error: strapiData.error.message },
        { status: 400 }
      );
    }

    // Set JWT in cookies and redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': `jwt=${strapiData.jwt}; Path=/; HttpOnly; Secure;`,
      },
    });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.json(
      { error: 'Google authentication failed' },
      { status: 500 }
    );
  }
}

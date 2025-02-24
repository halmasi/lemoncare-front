'use client';

export default function GoogleLoginButton() {
  const handleLogin = () => {
    const googleAuthUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );
    googleAuthUrl.searchParams.set(
      'client_id',
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
    );
    googleAuthUrl.searchParams.set(
      'redirect_uri',
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string
    );
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    window.location.href = googleAuthUrl.toString();
  };

  return (
    <button onClick={handleLogin} className="bg-red-500 text-white p-2 rounded">
      Sign in with Google
    </button>
  );
}

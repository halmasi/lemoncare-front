'use client';

export default function GoogleLoginButton() {
  const handleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    &redirect_uri=${process.env.SITE_URL}${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}
    &response_type=token
    &scope=email%20profile
    &include_granted_scopes=true`;

    window.location.href = googleAuthUrl;
  };

  return (
    <button onClick={handleLogin} className="bg-red-500 text-white p-2 rounded">
      Sign in with Google
    </button>
  );
}

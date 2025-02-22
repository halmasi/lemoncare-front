'use client';

import { useEffect } from 'react';

export default function GoogleScriptLoader() {
  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-login-script')) return;

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-login-script';
      document.body.appendChild(script);

      script.onload = () => {
        console.log('Google API Loaded.');
        initializeGoogleLogin();
      };
    };

    const initializeGoogleLogin = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            console.log('Google Login Response:', response);
          },
        });
      } else {
        console.error('Google API not loaded.');
      }
    };

    loadGoogleScript();
  }, []);

  console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return null;
}

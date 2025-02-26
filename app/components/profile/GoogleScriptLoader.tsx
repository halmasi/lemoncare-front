'use client';
import logs from '@/app/utils/logs';
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
        initializeGoogleLogin();
      };

      script.onerror = () => {
        logs('Google API script failed to load.', 'error');
      };
    };

    const initializeGoogleLogin = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });
      } else {
        logs('Google API not loaded.', 'error');
      }
    };

    loadGoogleScript();
  }, []);

  return null;
}

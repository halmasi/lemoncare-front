import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      // Pass token data to the session object
      session.user = token.user || null;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect logic based on user session or route
      if (url.startsWith('/dashboard')) {
        return baseUrl + '/login'; // Redirect to login if unauthenticated
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  providers: [
    credentials:
    // Example provider: Google OAuth
    // Import `GoogleProvider` from 'next-auth/providers/google'
    // Replace CLIENT_ID and CLIENT_SECRET with actual credentials
  ],
};

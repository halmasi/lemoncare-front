//import type { NextAuthOptions } from 'next-auth';
//import CredentialsProvider from 'next-auth/providers/credentials';
//import NextAuth from 'next-auth';
//import { NextAuthOptions, Session, User, Account, JWT } from 'next-auth';
//import GoogleProvider from 'next-auth/providers/google';

// export const authConfig: NextAuthOptions = {
//   pages: {
//     signIn: '/login', // Custom sign-in page
//   },
//   callbacks: {
//     async session({ session, token }) {
//       // Pass token data to the session object
//       session.user = token.user ? { ...token.user } : undefined;
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Redirect logic based on user session or route
//       if (url.startsWith('/dashboard')) {
//         return baseUrl + '/login'; // Redirect to login if unauthenticated
//       }
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: {
//           type: 'email',
//         },
//         password: { type: 'password' },
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         // Make API request to authenticate user
//         const res = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             identifier: email,
//             password: password,
//           }),
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.error?.message || 'Invalid credentials');
//         }

//         const user = await res.json();

//         // Ensure user data is properly returned
//         if (user) {
//           return {
//             id: user.user.id,
//             email: user.user.email,
//             jwt: user.jwt, // Include JWT if needed
//           };
//         }

//         return null;
//       },
//     }),
//   ],
// };
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    jwt: any;
    id: any;
  }

  interface User {
    id: string;
    jwt: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.BACKEND_PATH}/auth/local`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || 'Invalid credentials');
        }

        const user = await res.json();
        return {
          id: user.user.id,
          email: user.user.email,
          jwt: user.jwt,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async session({ session, token }) {
      session.jwt = token.jwt;
      session.id = token.id;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/${account.provider}/callback?access_token=${account.access_token}`
        );
        const data = await res.json();
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      console.log('####################', token);
      return token;
    },
  },
};

export default NextAuth(authOptions);

import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const estConnecte = !!auth?.user;
      const zoneProtegee =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/transactions') ||
        nextUrl.pathname.startsWith('/objectifs');

      if (zoneProtegee) {
        return estConnecte; // false → redirige automatiquement vers pages.signIn
      }

      if (estConnecte && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // le provider Credentials est ajouté dans lib/auth.ts (nécessite Node.js)
};
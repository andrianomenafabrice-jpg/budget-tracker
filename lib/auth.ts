import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';
import { getDb } from './db';
import { users } from './db/schema';
import { identifiantsSchema } from './validations/auth.schema';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const resultat = identifiantsSchema.safeParse(credentials);
        if (!resultat.success) return null;

        const { email, password } = resultat.data;
        const db = getDb();
        const [utilisateur] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!utilisateur) return null;

        const motDePasseValide = await bcrypt.compare(password, utilisateur.motDePasseHash);
        if (!motDePasseValide) return null;

        return {
          id: utilisateur.id,
          name: utilisateur.nom,
          email: utilisateur.email,
        };
      },
    }),
  ],
});
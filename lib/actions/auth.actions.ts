'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { signIn } from '@/lib/auth';
import { identifiantsSchema, inscriptionSchema } from '@/lib/validations/auth.schema';
import type { ResultatAction } from '@/lib/types/action';

export async function inscrire(
  _etatPrecedent: ResultatAction<{ id: string }> | null,
  formData: FormData
): Promise<ResultatAction<{ id: string }>> {
  const donneesBrutes = {
    nom: formData.get('nom'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmationMotDePasse: formData.get('confirmationMotDePasse'),
  };

  const resultat = inscriptionSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: resultat.error.issues[0]?.message ?? 'Données invalides',
      },
    };
  }

  const { nom, email, password } = resultat.data;
  const db = getDb();

  const [utilisateurExistant] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (utilisateurExistant) {
    return {
      success: false,
      error: { code: 'EMAIL_DEJA_UTILISE', message: 'Un compte existe déjà avec cet email' },
    };
  }

  const motDePasseHash = await bcrypt.hash(password, 10);

  const [nouvelUtilisateur] = await db
    .insert(users)
    .values({ nom, email, motDePasseHash })
    .returning({ id: users.id });

  return { success: true, data: { id: nouvelUtilisateur.id } };
}

export async function connecter(
  _etatPrecedent: ResultatAction<null> | null,
  formData: FormData
): Promise<ResultatAction<null>> {
  const donneesBrutes = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const resultat = identifiantsSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: resultat.error.issues[0]?.message ?? 'Données invalides',
      },
    };
  }

  try {
    await signIn('credentials', {
      email: resultat.data.email,
      password: resultat.data.password,
      redirectTo: '/dashboard',
    });
    return { success: true, data: null };
  } catch (erreur) {
    if (erreur instanceof AuthError) {
      return {
        success: false,
        error: { code: 'IDENTIFIANTS_INVALIDES', message: 'Email ou mot de passe incorrect' },
      };
    }
    throw erreur; // le mécanisme interne de redirection de Next.js doit continuer à se propager
  }
}
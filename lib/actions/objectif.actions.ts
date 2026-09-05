'use server';

import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { savingsGoals } from '@/lib/db/schema';
import { objectifSchema, contributionSchema } from '@/lib/validations/objectif.schema';
import type { ResultatAction } from '@/lib/types/action';

export async function creerObjectif(
  _etatPrecedent: ResultatAction<{ id: string }> | null,
  formData: FormData
): Promise<ResultatAction<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const dateLimiteBrute = formData.get('dateLimite');
  const donneesBrutes = {
    nom: formData.get('nom'),
    montantCible: formData.get('montantCible'),
    dateLimite: dateLimiteBrute || undefined,
  };

  const resultat = objectifSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const db = getDb();
  const [nouvelObjectif] = await db
    .insert(savingsGoals)
    .values({ ...resultat.data, userId: session.user.id, montantActuel: '0' })
    .returning({ id: savingsGoals.id });

  revalidatePath('/objectifs');

  return { success: true, data: { id: nouvelObjectif.id } };
}

export async function ajouterContribution(
  objectifId: string,
  _etatPrecedent: ResultatAction<null> | null,
  formData: FormData
): Promise<ResultatAction<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const resultat = contributionSchema.safeParse({ montant: formData.get('montant') });
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Montant invalide' },
    };
  }

  const db = getDb();
  const misesAJour = await db
    .update(savingsGoals)
    .set({ montantActuel: sql`${savingsGoals.montantActuel} + ${resultat.data.montant}::numeric` })
    .where(and(eq(savingsGoals.id, objectifId), eq(savingsGoals.userId, session.user.id)))
    .returning({ id: savingsGoals.id });

  if (misesAJour.length === 0) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Objectif introuvable' } };
  }

  revalidatePath('/objectifs');
  return { success: true, data: null };
}

export async function supprimerObjectif(objectifId: string): Promise<ResultatAction<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const db = getDb();
  const resultat = await db
    .delete(savingsGoals)
    .where(and(eq(savingsGoals.id, objectifId), eq(savingsGoals.userId, session.user.id)))
    .returning({ id: savingsGoals.id });

  if (resultat.length === 0) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Objectif introuvable' } };
  }

  revalidatePath('/objectifs');
  return { success: true, data: null };
}
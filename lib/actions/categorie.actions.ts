'use server';

import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { categories, transactions } from '@/lib/db/schema';
import { categorieSchema } from '@/lib/validations/categorie.schema';
import type { ResultatAction } from '@/lib/types/action';

export async function creerCategorie(
  _etatPrecedent: ResultatAction<{ id: string }> | null,
  formData: FormData
): Promise<ResultatAction<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const donneesBrutes = {
    nom: formData.get('nom'),
    type: formData.get('type'),
    couleur: formData.get('couleur'),
  };

  const resultat = categorieSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const db = getDb();
  const userId = session.user.id;

  const [categorieExistante] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.userId, userId), eq(categories.nom, resultat.data.nom)))
    .limit(1);

  if (categorieExistante) {
    return {
      success: false,
      error: { code: 'NOM_DEJA_UTILISE', message: 'Une catégorie porte déjà ce nom' },
    };
  }

  const [nouvelleCategorie] = await db
    .insert(categories)
    .values({ ...resultat.data, userId })
    .returning({ id: categories.id });

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: { id: nouvelleCategorie.id } };
}

export async function supprimerCategorie(categorieId: string): Promise<ResultatAction<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const db = getDb();
  const userId = session.user.id;

  const [transactionLiee] = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(eq(transactions.categoryId, categorieId))
    .limit(1);

  if (transactionLiee) {
    return {
      success: false,
      error: {
        code: 'CATEGORIE_UTILISEE',
        message: 'Cette catégorie a des transactions associées. Supprime-les ou réassigne-les d’abord.',
      },
    };
  }

  const resultat = await db
    .delete(categories)
    .where(and(eq(categories.id, categorieId), eq(categories.userId, userId)))
    .returning({ id: categories.id });

  if (resultat.length === 0) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Catégorie introuvable' } };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: null };
}
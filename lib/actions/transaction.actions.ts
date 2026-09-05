'use server';

import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { transactions, categories } from '@/lib/db/schema';
import { transactionSchema } from '@/lib/validations/transaction.schema';
import type { ResultatAction } from '@/lib/types/action';

async function recupererCategoriePourUtilisateur(categoryId: string, userId: string) {
  const db = getDb();
  const [categorie] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .limit(1);
  return categorie ?? null;
}

export async function creerTransaction(
  _etatPrecedent: ResultatAction<{ id: string }> | null,
  formData: FormData
): Promise<ResultatAction<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const donneesBrutes = {
    categoryId: formData.get('categoryId'),
    montant: formData.get('montant'),
    description: formData.get('description') || undefined,
    date: formData.get('date'),
  };

  const resultat = transactionSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const userId = session.user.id;
  const categorie = await recupererCategoriePourUtilisateur(resultat.data.categoryId, userId);
  if (!categorie) {
    return { success: false, error: { code: 'CATEGORIE_INTROUVABLE', message: 'Catégorie invalide' } };
  }

  const db = getDb();
  const [nouvelleTransaction] = await db
    .insert(transactions)
    .values({
      ...resultat.data,
      userId,
      type: categorie.type, // dérivé de la catégorie, jamais resaisi (section 3)
    })
    .returning({ id: transactions.id });

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: { id: nouvelleTransaction.id } };
}

export async function modifierTransaction(
  transactionId: string,
  _etatPrecedent: ResultatAction<null> | null,
  formData: FormData
): Promise<ResultatAction<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const donneesBrutes = {
    categoryId: formData.get('categoryId'),
    montant: formData.get('montant'),
    description: formData.get('description') || undefined,
    date: formData.get('date'),
  };

  const resultat = transactionSchema.safeParse(donneesBrutes);
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const userId = session.user.id;
  const categorie = await recupererCategoriePourUtilisateur(resultat.data.categoryId, userId);
  if (!categorie) {
    return { success: false, error: { code: 'CATEGORIE_INTROUVABLE', message: 'Catégorie invalide' } };
  }

  const db = getDb();
  const misesAJour = await db
    .update(transactions)
    .set({ ...resultat.data, type: categorie.type })
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
    .returning({ id: transactions.id });

  if (misesAJour.length === 0) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Transaction introuvable' } };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: null };
}

export async function supprimerTransaction(transactionId: string): Promise<ResultatAction<null>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const db = getDb();
  const userId = session.user.id;

  const resultat = await db
    .delete(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
    .returning({ id: transactions.id });

  if (resultat.length === 0) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Transaction introuvable' } };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: null };
}
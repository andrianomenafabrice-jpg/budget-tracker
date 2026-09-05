'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { transactionSchema } from '@/lib/validations/transaction.schema';
import {
  creerTransactionPourUtilisateur,
  modifierTransactionPourUtilisateur,
  supprimerTransactionPourUtilisateur,
} from '@/lib/repositories/transaction.repository';
import type { ResultatAction } from '@/lib/types/action';

function extraireDonneesBrutes(formData: FormData) {
  return {
    categoryId: formData.get('categoryId'),
    montant: formData.get('montant'),
    description: formData.get('description') || undefined,
    date: formData.get('date'),
  };
}

export async function creerTransaction(
  _etatPrecedent: ResultatAction<{ id: string }> | null,
  formData: FormData
): Promise<ResultatAction<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const resultat = transactionSchema.safeParse(extraireDonneesBrutes(formData));
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const reponse = await creerTransactionPourUtilisateur(session.user.id, resultat.data);
  if (!reponse.trouve) {
    return { success: false, error: { code: 'CATEGORIE_INTROUVABLE', message: 'Catégorie invalide' } };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');
  return { success: true, data: { id: reponse.id } };
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

  const resultat = transactionSchema.safeParse(extraireDonneesBrutes(formData));
  if (!resultat.success) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: resultat.error.issues[0]?.message ?? 'Données invalides' },
    };
  }

  const reponse = await modifierTransactionPourUtilisateur(session.user.id, transactionId, resultat.data);
  if (!reponse.trouve) {
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

  const reponse = await supprimerTransactionPourUtilisateur(session.user.id, transactionId);
  if (!reponse.trouve) {
    return { success: false, error: { code: 'INTROUVABLE', message: 'Transaction introuvable' } };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');
  return { success: true, data: null };
}
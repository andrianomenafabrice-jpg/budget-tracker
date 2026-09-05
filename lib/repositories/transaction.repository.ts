import { and, eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { transactions, categories } from '@/lib/db/schema';
import type { TransactionInput } from '@/lib/validations/transaction.schema';

export async function creerTransactionPourUtilisateur(userId: string, donnees: TransactionInput) {
  const db = getDb();
  const [categorie] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, donnees.categoryId), eq(categories.userId, userId)))
    .limit(1);

  if (!categorie) return { trouve: false as const };

  const [nouvelleTransaction] = await db
    .insert(transactions)
    .values({ ...donnees, userId, type: categorie.type })
    .returning({ id: transactions.id });

  return { trouve: true as const, id: nouvelleTransaction.id };
}

export async function modifierTransactionPourUtilisateur(
  userId: string,
  transactionId: string,
  donnees: TransactionInput
) {
  const db = getDb();
  const [categorie] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, donnees.categoryId), eq(categories.userId, userId)))
    .limit(1);

  if (!categorie) return { trouve: false as const };

  const misesAJour = await db
    .update(transactions)
    .set({ ...donnees, type: categorie.type })
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
    .returning({ id: transactions.id });

  return { trouve: misesAJour.length > 0 };
}

export async function supprimerTransactionPourUtilisateur(userId: string, transactionId: string) {
  const db = getDb();
  const resultat = await db
    .delete(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
    .returning({ id: transactions.id });

  return { trouve: resultat.length > 0 };
}

export async function recupererTransactionParId(transactionId: string) {
  const db = getDb();
  const [transaction] = await db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
  return transaction ?? null;
}
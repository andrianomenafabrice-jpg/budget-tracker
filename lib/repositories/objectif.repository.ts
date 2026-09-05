import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { savingsGoals } from '@/lib/db/schema';

export async function ajouterContributionPourUtilisateur(userId: string, objectifId: string, montant: string) {
  const db = getDb();
  const misesAJour = await db
    .update(savingsGoals)
    .set({ montantActuel: sql`${savingsGoals.montantActuel} + ${montant}::numeric` })
    .where(and(eq(savingsGoals.id, objectifId), eq(savingsGoals.userId, userId)))
    .returning({ id: savingsGoals.id });

  return { trouve: misesAJour.length > 0 };
}

export async function supprimerObjectifPourUtilisateur(userId: string, objectifId: string) {
  const db = getDb();
  const resultat = await db
    .delete(savingsGoals)
    .where(and(eq(savingsGoals.id, objectifId), eq(savingsGoals.userId, userId)))
    .returning({ id: savingsGoals.id });

  return { trouve: resultat.length > 0 };
}

export async function recupererObjectifParId(objectifId: string) {
  const db = getDb();
  const [objectif] = await db.select().from(savingsGoals).where(eq(savingsGoals.id, objectifId)).limit(1);
  return objectif ?? null;
}
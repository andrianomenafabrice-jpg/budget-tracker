'use server';

import { and, eq, gte, lte } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { filtreTransactionSchema } from '@/lib/validations/filtreTransaction.schema';
import type { ResultatAction } from '@/lib/types/action';

type FiltresExport = {
  categoryId?: string;
  type?: 'depense' | 'revenu';
  dateDebut?: string;
  dateFin?: string;
};

function echapperChampCsv(valeur: string): string {
  if (valeur.includes(';') || valeur.includes('"') || valeur.includes('\n')) {
    return `"${valeur.replace(/"/g, '""')}"`;
  }
  return valeur;
}

export async function exporterTransactionsCsv(filtresBruts: FiltresExport): Promise<ResultatAction<{ csv: string }>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: { code: 'NON_AUTHENTIFIE', message: 'Session expirée, reconnecte-toi.' } };
  }

  const resultatFiltres = filtreTransactionSchema.safeParse({ ...filtresBruts, page: 1 });
  const filtres = resultatFiltres.success ? resultatFiltres.data : { page: 1 };

  const db = getDb();
  const userId = session.user.id;

  const conditions = [eq(transactions.userId, userId)];
  if (filtres.categoryId) conditions.push(eq(transactions.categoryId, filtres.categoryId));
  if (filtres.type) conditions.push(eq(transactions.type, filtres.type));
  if (filtres.dateDebut) conditions.push(gte(transactions.date, filtres.dateDebut));
  if (filtres.dateFin) conditions.push(lte(transactions.date, filtres.dateFin));

  const lignes = await db.query.transactions.findMany({
    where: and(...conditions),
    orderBy: (transactions, { desc }) => [desc(transactions.date)],
    with: { categorie: true },
  });

  const entete = ['Date', 'Type', 'Catégorie', 'Description', 'Montant'].join(';');
  const corps = lignes.map((ligne) =>
    [
      new Date(ligne.date).toLocaleDateString('fr-FR'),
      ligne.type === 'revenu' ? 'Revenu' : 'Dépense',
      echapperChampCsv(ligne.categorie.nom),
      echapperChampCsv(ligne.description ?? ''),
      ligne.montant,
    ].join(';')
  );

  const csv = [entete, ...corps].join('\n');

  return { success: true, data: { csv } };
}
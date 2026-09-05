import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { calculerAgregationMensuelle } from '@/lib/services/agregation.service';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PageTableauDeBord() {
  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const mesTransactions = await db.select().from(transactions).where(eq(transactions.userId, userId));

  const moisActuel = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const agregation = calculerAgregationMensuelle(mesTransactions, moisActuel);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-texte-principal dark:text-texte-inverse">
        Tableau de bord
      </h1>

      <div className="border-l-4 border-marge-registre p-6">
        <p className="font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">Solde du mois</p>
        <p
          className={`font-mono text-3xl font-bold tabular-nums ${
            agregation.solde >= 0 ? 'text-encre-credit' : 'text-encre-debit'
          }`}
        >
          {agregation.solde >= 0 ? '+' : ''}
          {agregation.solde.toFixed(2)} €
        </p>
        <p className="mt-2 font-mono text-sm tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
          Revenus +{agregation.totalRevenus.toFixed(2)} € · Dépenses −{agregation.totalDepenses.toFixed(2)} €
        </p>
      </div>

      <p className="font-sans text-sm text-texte-principal/60 dark:text-texte-inverse/60">
        Les graphiques d’évolution et de répartition arrivent à la phase suivante.
      </p>
    </div>
  );
}
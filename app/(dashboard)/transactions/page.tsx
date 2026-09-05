import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { categories, transactions } from '@/lib/db/schema';
import { FormulaireCategorie } from '@/components/transactions/FormulaireCategorie';
import { FormulaireTransaction } from '@/components/transactions/FormulaireTransaction';
import { ListeTransactions } from '@/components/transactions/ListeTransactions';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PageTransactions() {
  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const [mesCategories, mesTransactions] = await Promise.all([
    db.select().from(categories).where(eq(categories.userId, userId)),
    db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
      with: { categorie: true },
      limit: 50,
    }),
  ]);

  const transactionsAffichees = mesTransactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    montant: transaction.montant,
    description: transaction.description,
    date: transaction.date,
    categorieNom: transaction.categorie.nom,
    categorieCouleur: transaction.categorie.couleur,
  }));

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-2xl font-bold text-texte-principal dark:text-texte-inverse">
          Transactions
        </h1>
        <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Enregistre une dépense ou un revenu.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-texte-principal/60 dark:text-texte-inverse/60">
          Catégories
        </h2>
        <FormulaireCategorie />
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-texte-principal/60 dark:text-texte-inverse/60">
          Nouvelle transaction
        </h2>
        <FormulaireTransaction categories={mesCategories} />
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-texte-principal/60 dark:text-texte-inverse/60">
          Historique (50 dernières)
        </h2>
        <ListeTransactions transactions={transactionsAffichees} />
      </section>
    </div>
  );
}
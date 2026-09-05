import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { categories, transactions } from '@/lib/db/schema';
import { parserFiltresTransactions } from '@/lib/validations/filtreTransaction.schema';
import { FormulaireCategorie } from '@/components/transactions/FormulaireCategorie';
import { FormulaireTransaction } from '@/components/transactions/FormulaireTransaction';
import { FiltresTransactions } from '@/components/transactions/FiltresTransactions';
import { ListeTransactions } from '@/components/transactions/ListeTransactions';
import { Pagination } from '@/components/transactions/Pagination';
import { BoutonExportCsv } from '@/components/transactions/BoutonExportCsv';

export const metadata = {
  robots: { index: false, follow: false },
};

const TAILLE_PAGE = 20;

type SearchParamsBruts = { [cle: string]: string | string[] | undefined };

export default async function PageTransactions({
  searchParams,
}: {
  searchParams: Promise<SearchParamsBruts>;
}) {
  const searchParamsResolus = await searchParams;
  const filtres = parserFiltresTransactions(searchParamsResolus);

  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const conditions = [eq(transactions.userId, userId)];
  if (filtres.categoryId) conditions.push(eq(transactions.categoryId, filtres.categoryId));
  if (filtres.type) conditions.push(eq(transactions.type, filtres.type));
  if (filtres.dateDebut) conditions.push(gte(transactions.date, filtres.dateDebut));
  if (filtres.dateFin) conditions.push(lte(transactions.date, filtres.dateFin));
  const clauseWhere = and(...conditions);

  const decalage = (filtres.page - 1) * TAILLE_PAGE;

  const [mesCategories, mesTransactions, [{ total }]] = await Promise.all([
    db.select().from(categories).where(eq(categories.userId, userId)),
    db.query.transactions.findMany({
      where: clauseWhere,
      orderBy: (transactions, { desc }) => [desc(transactions.date)],
      with: { categorie: true },
      limit: TAILLE_PAGE,
      offset: decalage,
    }),
    db.select({ total: sql<number>`count(*)::int` }).from(transactions).where(clauseWhere),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  const transactionsAffichees = mesTransactions.map((transaction) => ({
    id: transaction.id,
    type: transaction.type,
    montant: transaction.montant,
    description: transaction.description,
    date: transaction.date,
    categorieNom: transaction.categorie.nom,
    categorieCouleur: transaction.categorie.couleur,
  }));

  const parametresPourPagination: Record<string, string | undefined> = {
    categoryId: searchParamsResolus.categoryId as string | undefined,
    type: searchParamsResolus.type as string | undefined,
    dateDebut: searchParamsResolus.dateDebut as string | undefined,
    dateFin: searchParamsResolus.dateFin as string | undefined,
  };

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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-texte-principal/60 dark:text-texte-inverse/60">
            Historique {total > 0 && `(${total} au total)`}
          </h2>
          <BoutonExportCsv />
        </div>
        <FiltresTransactions categories={mesCategories} />
        <div className="mt-4">
          <ListeTransactions transactions={transactionsAffichees} />
        </div>
        <div className="mt-6">
          <Pagination pageActuelle={filtres.page} totalPages={totalPages} parametresActuels={parametresPourPagination} />
        </div>
      </section>
    </div>
  );
}
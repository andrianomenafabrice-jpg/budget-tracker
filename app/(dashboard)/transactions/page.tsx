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
  title: 'Transactions',
  robots: { index: false, follow: false },
};

const TAILLE_PAGE = 20;

type SearchParamsBruts = { [cle: string]: string | string[] | undefined };

export default async function PageTransactions({ searchParams }: { searchParams: Promise<SearchParamsBruts> }) {
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
      orderBy: (t, { desc }) => [desc(t.date)],
      with: { categorie: true },
      limit: TAILLE_PAGE,
      offset: decalage,
    }),
    db.select({ total: sql<number>`count(*)::int` }).from(transactions).where(clauseWhere),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / TAILLE_PAGE));

  const transactionsAffichees = mesTransactions.map((t) => ({
    id: t.id,
    type: t.type,
    montant: t.montant,
    description: t.description,
    date: t.date,
    categorieNom: t.categorie.nom,
    categorieCouleur: t.categorie.couleur,
  }));

  const parametresPourPagination: Record<string, string | undefined> = {
    categoryId: searchParamsResolus.categoryId as string | undefined,
    type: searchParamsResolus.type as string | undefined,
    dateDebut: searchParamsResolus.dateDebut as string | undefined,
    dateFin: searchParamsResolus.dateFin as string | undefined,
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-texte-principal dark:text-texte-inverse">Transactions</h1>
        <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Enregistre une dépense ou un revenu.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-texte-principal dark:text-texte-inverse">Catégories</h2>
        <FormulaireCategorie />
      </section>

      <section className="space-y-3">
        <h2 className="text-texte-principal dark:text-texte-inverse">Nouvelle transaction</h2>
        <FormulaireTransaction categories={mesCategories} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-texte-principal dark:text-texte-inverse">
            Historique {total > 0 && <span className="font-sans text-sm font-normal text-texte-principal/60 dark:text-texte-inverse/60">({total} au total)</span>}
          </h2>
          <BoutonExportCsv />
        </div>
        <FiltresTransactions categories={mesCategories} />
        <ListeTransactions transactions={transactionsAffichees} />
        <Pagination pageActuelle={filtres.page} totalPages={totalPages} parametresActuels={parametresPourPagination} />
      </section>
    </div>
  );
}
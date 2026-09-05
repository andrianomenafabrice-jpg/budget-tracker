import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { categories, transactions } from '@/lib/db/schema';
import { TableauDeBordClient } from '@/components/dashboard/TableauDeBordClient';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PageTableauDeBord() {
  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const [mesTransactions, mesCategories] = await Promise.all([
    db
      .select({
        categoryId: transactions.categoryId,
        type: transactions.type,
        montant: transactions.montant,
        date: transactions.date,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId)),
    db.select().from(categories).where(eq(categories.userId, userId)),
  ]);

  return <TableauDeBordClient transactions={mesTransactions} categories={mesCategories} />;
}
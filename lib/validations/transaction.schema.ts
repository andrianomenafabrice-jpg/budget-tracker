import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from '@/lib/db/schema';
import { montantSchema } from './montant.schema';

export const transactionSchema = createInsertSchema(transactions, {
  montant: () => montantSchema,
  description: (schema) => schema.trim().max(500, 'Description trop longue'),
  date: () => z.coerce.date(),
}).pick({ categoryId: true, montant: true, description: true, date: true });

export type TransactionInput = z.infer<typeof transactionSchema>;
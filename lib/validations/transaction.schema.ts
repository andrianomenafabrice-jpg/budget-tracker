import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from '@/lib/db/schema';

const montantSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, 'Montant invalide (ex. 19.99, 2 décimales max)')
  .refine((valeur) => Number(valeur) > 0, 'Le montant doit être supérieur à 0');

export const transactionSchema = createInsertSchema(transactions, {
  montant: () => montantSchema,
  description: (schema) => schema.trim().max(500, 'Description trop longue'),
  date: () => z.coerce.date(),
}).pick({ categoryId: true, montant: true, description: true, date: true });

export type TransactionInput = z.infer<typeof transactionSchema>;
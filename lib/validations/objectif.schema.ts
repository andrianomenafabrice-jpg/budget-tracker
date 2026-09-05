import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { savingsGoals } from '@/lib/db/schema';
import { montantSchema } from './montant.schema';

export const objectifSchema = createInsertSchema(savingsGoals, {
  nom: (schema) => schema.trim().min(1, 'Le nom est requis').max(120, 'Le nom est trop long'),
  montantCible: () => montantSchema,
  dateLimite: () => z.coerce.date(),
}).pick({ nom: true, montantCible: true, dateLimite: true });

export type ObjectifInput = z.infer<typeof objectifSchema>;

export const contributionSchema = z.object({
  montant: montantSchema,
});

export type ContributionInput = z.infer<typeof contributionSchema>;
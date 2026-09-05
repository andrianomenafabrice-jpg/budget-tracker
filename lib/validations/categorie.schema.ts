import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { categories } from '@/lib/db/schema';

export const categorieSchema = createInsertSchema(categories, {
  nom: (schema) => schema.trim().min(1, 'Le nom est requis').max(80, 'Le nom est trop long'),
  couleur: (schema) => schema.regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide (format hex, ex. #4F6B4A)'),
}).omit({ id: true, userId: true, createdAt: true });

export type CategorieInput = z.infer<typeof categorieSchema>;
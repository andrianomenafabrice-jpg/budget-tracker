import { z } from 'zod';

export const montantSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, 'Montant invalide (ex. 19.99, 2 décimales max)')
  .refine((valeur) => Number(valeur) > 0, 'Le montant doit être supérieur à 0');
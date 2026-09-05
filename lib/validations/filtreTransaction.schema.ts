import { z } from 'zod';

type SearchParamsBruts = { [cle: string]: string | string[] | undefined };

function normaliserSearchParams(searchParams: SearchParamsBruts): Record<string, string | undefined> {
  const resultat: Record<string, string | undefined> = {};
  for (const [cle, valeur] of Object.entries(searchParams)) {
    resultat[cle] = Array.isArray(valeur) ? valeur[0] : valeur;
  }
  return resultat;
}

const champOptionnel = (schema: z.ZodTypeAny) =>
  z.preprocess((valeur) => (valeur === '' || valeur === undefined ? undefined : valeur), schema.optional());

export const filtreTransactionSchema = z.object({
  categoryId: champOptionnel(z.string().uuid()),
  type: champOptionnel(z.enum(['depense', 'revenu'])),
  dateDebut: champOptionnel(z.coerce.date()),
  dateFin: champOptionnel(z.coerce.date()),
  page: z.preprocess((valeur) => (valeur === undefined || valeur === '' ? 1 : valeur), z.coerce.number().int().positive()),
});

export type FiltreTransactionInput = z.infer<typeof filtreTransactionSchema>;

/** Parse les searchParams bruts de l'URL ; retombe silencieusement sur les valeurs par défaut si un paramètre est invalide (ex. UUID mal formé tapé à la main). */
export function parserFiltresTransactions(searchParamsBruts: SearchParamsBruts): FiltreTransactionInput {
  const normalise = normaliserSearchParams(searchParamsBruts);
  const resultat = filtreTransactionSchema.safeParse(normalise);
  if (!resultat.success) {
    return { page: 1 };
  }
  return resultat.data;
}
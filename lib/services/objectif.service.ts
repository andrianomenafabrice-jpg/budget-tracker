import { versCentimes } from '@/lib/utils/money';

export type ObjectifPourCalcul = {
  montantActuel: string | number;
  montantCible: string | number;
};

export type ProgressionObjectif = {
  pourcentage: number;
  atteint: boolean;
};

/**
 * Choix documenté : si montantCible <= 0, aucune progression n'est
 * mathématiquement mesurable (division par zéro évitée explicitement).
 * On considère alors l'objectif atteint uniquement si un montant a déjà
 * été épargné (> 0), sans jamais renvoyer NaN ni Infinity.
 */
export function calculerProgressionObjectif(objectif: ObjectifPourCalcul): ProgressionObjectif {
  const actuelCentimes = versCentimes(objectif.montantActuel);
  const cibleCentimes = versCentimes(objectif.montantCible);

  if (cibleCentimes <= 0) {
    return {
      pourcentage: 0,
      atteint: actuelCentimes > 0,
    };
  }

  const ratio = (actuelCentimes / cibleCentimes) * 100;
  const pourcentage = Math.min(Math.max(ratio, 0), 100);

  return {
    pourcentage: Math.round(pourcentage * 100) / 100,
    atteint: actuelCentimes >= cibleCentimes,
  };
}
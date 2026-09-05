import { versCentimes, centimesVersNombre } from '@/lib/utils/money';

export type TransactionPourCalcul = {
  categoryId: string;
  type: 'depense' | 'revenu';
  montant: string | number;
  date: Date;
};

export type CategoriePourCalcul = {
  id: string;
  nom: string;
  couleur: string;
};

export type AgregationMensuelle = {
  mois: string;
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
};

export type RepartitionCategorie = {
  categorieId: string;
  nom: string;
  couleur: string;
  montant: number;
};

/** Calcule les bornes [début, fin[ d'un mois au format "YYYY-MM", en UTC. */
function limitesMois(mois: string): { debut: Date; fin: Date } {
  const [annee, moisNum] = mois.split('-').map(Number);
  const debut = new Date(Date.UTC(annee, moisNum - 1, 1));
  const fin = new Date(Date.UTC(annee, moisNum, 1));
  return { debut, fin };
}

export function calculerAgregationMensuelle(
  transactions: TransactionPourCalcul[],
  mois: string
): AgregationMensuelle {
  const { debut, fin } = limitesMois(mois);

  let totalRevenusCentimes = 0;
  let totalDepensesCentimes = 0;

  for (const transaction of transactions) {
    const dateTransaction = new Date(transaction.date);
    if (dateTransaction < debut || dateTransaction >= fin) continue;

    const centimes = versCentimes(transaction.montant);
    if (transaction.type === 'revenu') {
      totalRevenusCentimes += centimes;
    } else {
      totalDepensesCentimes += centimes;
    }
  }

  return {
    mois,
    totalRevenus: centimesVersNombre(totalRevenusCentimes),
    totalDepenses: centimesVersNombre(totalDepensesCentimes),
    solde: centimesVersNombre(totalRevenusCentimes - totalDepensesCentimes),
  };
}

export function calculerRepartitionParCategorie(
  transactions: TransactionPourCalcul[],
  categories: CategoriePourCalcul[],
  mois: string
): RepartitionCategorie[] {
  const { debut, fin } = limitesMois(mois);
  const totauxParCategorie = new Map<string, number>();

  for (const transaction of transactions) {
    const dateTransaction = new Date(transaction.date);
    if (dateTransaction < debut || dateTransaction >= fin) continue;

    const centimes = versCentimes(transaction.montant);
    const cumul = totauxParCategorie.get(transaction.categoryId) ?? 0;
    totauxParCategorie.set(transaction.categoryId, cumul + centimes);
  }

  const resultat: RepartitionCategorie[] = [];
  for (const categorie of categories) {
    const centimes = totauxParCategorie.get(categorie.id);
    if (!centimes) continue; // catégorie sans transaction ce mois-ci → exclue du camembert

    resultat.push({
      categorieId: categorie.id,
      nom: categorie.nom,
      couleur: categorie.couleur,
      montant: centimesVersNombre(centimes),
    });
  }

  return resultat;
}
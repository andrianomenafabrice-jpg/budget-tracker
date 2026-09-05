'use client';

import { useMemo, useState } from 'react';
import {
  calculerAgregationMensuelle,
  calculerEvolutionMensuelle,
  calculerRepartitionParCategorie,
  derniersMois,
  type TransactionPourCalcul,
  type CategoriePourCalcul,
} from '@/lib/services/agregation.service';
import { SelecteurMois } from './SelecteurMois';
import { CarteSolde } from './CarteSolde';
import { GraphiqueEvolution } from './GraphiqueEvolution';
import { GraphiqueRepartition } from './GraphiqueRepartition';

const NOMBRE_MOIS_HISTORIQUE = 6;

export function TableauDeBordClient({
  transactions,
  categories,
}: {
  transactions: TransactionPourCalcul[];
  categories: CategoriePourCalcul[];
}) {
  const moisDisponibles = useMemo(() => derniersMois(NOMBRE_MOIS_HISTORIQUE), []);
  const [moisSelectionne, setMoisSelectionne] = useState(moisDisponibles[moisDisponibles.length - 1]);

  const agregation = useMemo(
    () => calculerAgregationMensuelle(transactions, moisSelectionne),
    [transactions, moisSelectionne]
  );

  const evolution = useMemo(
    () => calculerEvolutionMensuelle(transactions, NOMBRE_MOIS_HISTORIQUE),
    [transactions]
  );

  const repartition = useMemo(
    () => calculerRepartitionParCategorie(transactions, categories, moisSelectionne),
    [transactions, categories, moisSelectionne]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-texte-principal dark:text-texte-inverse">
          Tableau de bord
        </h1>
        <SelecteurMois
          moisDisponibles={moisDisponibles}
          moisSelectionne={moisSelectionne}
          onChange={setMoisSelectionne}
        />
      </div>

      <CarteSolde agregation={agregation} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold text-texte-principal/70 dark:text-texte-inverse/70">
            Évolution sur {NOMBRE_MOIS_HISTORIQUE} mois
          </h2>
          <GraphiqueEvolution donnees={evolution} />
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-semibold text-texte-principal/70 dark:text-texte-inverse/70">
            Répartition par catégorie
          </h2>
          <GraphiqueRepartition donnees={repartition} />
        </div>
      </div>
    </div>
  );
}
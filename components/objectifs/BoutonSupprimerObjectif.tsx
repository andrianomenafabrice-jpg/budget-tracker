'use client';

import { useTransition } from 'react';
import { supprimerObjectif } from '@/lib/actions/objectif.actions';

export function BoutonSupprimerObjectif({ objectifId }: { objectifId: string }) {
  const [enSuppression, demarrerSuppression] = useTransition();

  function gererSuppression() {
    if (!window.confirm('Supprimer définitivement cet objectif ?')) return;
    demarrerSuppression(async () => {
      await supprimerObjectif(objectifId);
    });
  }

  return (
    <button
      type="button"
      onClick={gererSuppression}
      disabled={enSuppression}
      className="font-sans text-xs text-texte-principal/50 hover:text-encre-debit disabled:opacity-40 dark:text-texte-inverse/50"
    >
      Supprimer
    </button>
  );
}
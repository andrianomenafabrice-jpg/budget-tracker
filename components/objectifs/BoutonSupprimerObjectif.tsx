'use client';

import { useTransition } from 'react';
import { supprimerObjectif } from '@/lib/actions/objectif.actions';
import { useConfirmation } from '@/components/ui/ConfirmProvider';
import { useToast } from '@/components/ui/ToastProvider';

export function BoutonSupprimerObjectif({ objectifId }: { objectifId: string }) {
  const demanderConfirmation = useConfirmation();
  const afficherToast = useToast();
  const [enSuppression, demarrerSuppression] = useTransition();

  async function gererSuppression() {
    const confirme = await demanderConfirmation('Supprimer définitivement cet objectif ?');
    if (!confirme) return;

    demarrerSuppression(async () => {
      const resultat = await supprimerObjectif(objectifId);
      afficherToast(resultat.success ? 'Objectif supprimé' : resultat.error.message, resultat.success ? 'succes' : 'erreur');
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
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { ajouterContribution } from '@/lib/actions/objectif.actions';
import { useToast } from '@/components/ui/ToastProvider';

export function FormulaireContribution({ objectifId }: { objectifId: string }) {
  const actionAvecId = ajouterContribution.bind(null, objectifId);
  const [etat, action, enCours] = useActionState(actionAvecId, null);
  const formRef = useRef<HTMLFormElement>(null);
  const afficherToast = useToast();

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
      afficherToast('Contribution ajoutée');
    }
  }, [etat, afficherToast]);

  return (
    <form ref={formRef} action={action} className="mt-4 flex flex-wrap items-center gap-2">
      <label htmlFor={`contribution-${objectifId}`} className="sr-only">
        Montant à ajouter
      </label>
      <input
        id={`contribution-${objectifId}`}
        name="montant"
        type="text"
        inputMode="decimal"
        required
        placeholder="+ 50.00"
        className="w-28 border border-texte-principal/25 bg-transparent px-2 py-1.5 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/25 dark:text-texte-inverse"
      />
      <button
        type="submit"
        disabled={enCours}
        className="bg-encre-credit px-3 py-1.5 font-sans text-sm font-semibold text-texte-inverse disabled:opacity-60"
      >
        {enCours ? '...' : 'Ajouter'}
      </button>
      {etat && !etat.success && <span className="font-sans text-xs text-encre-debit">{etat.error.message}</span>}
    </form>
  );
}
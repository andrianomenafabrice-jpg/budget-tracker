'use client';

import { useActionState, useEffect, useRef } from 'react';
import { ajouterContribution } from '@/lib/actions/objectif.actions';

export function FormulaireContribution({ objectifId }: { objectifId: string }) {
  const actionAvecId = ajouterContribution.bind(null, objectifId);
  const [etat, action, enCours] = useActionState(actionAvecId, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
    }
  }, [etat]);

  return (
    <form ref={formRef} action={action} className="mt-3 flex items-center gap-2">
      <input
        name="montant"
        type="text"
        inputMode="decimal"
        required
        placeholder="+ 50.00"
        className="w-24 border border-texte-principal/30 bg-transparent px-2 py-1 font-mono text-xs text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
      />
      <button
        type="submit"
        disabled={enCours}
        className="bg-encre-credit px-3 py-1 font-sans text-xs font-semibold text-texte-inverse disabled:opacity-60"
      >
        {enCours ? '...' : 'Ajouter'}
      </button>
      {etat && !etat.success && <span className="font-sans text-xs text-encre-debit">{etat.error.message}</span>}
    </form>
  );
}
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { creerObjectif } from '@/lib/actions/objectif.actions';

export function FormulaireObjectif() {
  const [etat, action, enCours] = useActionState(creerObjectif, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
    }
  }, [etat]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3 border-l-4 border-marge-registre p-4">
      <div className="flex flex-col">
        <label htmlFor="nom-objectif" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Nom
        </label>
        <input
          id="nom-objectif"
          name="nom"
          type="text"
          required
          maxLength={120}
          placeholder="Vacances, fonds d'urgence..."
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="montantCible" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Montant cible
        </label>
        <input
          id="montantCible"
          name="montantCible"
          type="text"
          inputMode="decimal"
          required
          placeholder="1000.00"
          className="mt-1 w-32 border border-texte-principal/30 bg-transparent px-2 py-1 font-mono text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="dateLimite" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Date limite (optionnelle)
        </label>
        <input
          id="dateLimite"
          name="dateLimite"
          type="date"
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-mono text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      <button
        type="submit"
        disabled={enCours}
        className="bg-texte-principal px-4 py-1.5 font-sans text-sm font-semibold text-papier-registre disabled:opacity-60 dark:bg-texte-inverse dark:text-encre-nuit"
      >
        {enCours ? 'Création...' : 'Créer un objectif'}
      </button>

      {etat && !etat.success && (
        <p role="alert" className="w-full font-sans text-sm font-medium text-encre-debit">
          {etat.error.message}
        </p>
      )}
    </form>
  );
}
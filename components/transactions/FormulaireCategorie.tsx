'use client';

import { useActionState, useEffect, useRef } from 'react';
import { creerCategorie } from '@/lib/actions/categorie.actions';

const PALETTE_SUGGEREE = [
  { nom: 'Ardoise', valeur: '#2C4356' },
  { nom: 'Prune', valeur: '#5B4566' },
  { nom: 'Mousse', valeur: '#4F6B4A' },
  { nom: 'Ocre', valeur: '#8C6A1F' },
  { nom: 'Gris ardoise', valeur: '#4A5560' },
  { nom: 'Brun terre', valeur: '#6B4A3A' },
];

export function FormulaireCategorie() {
  const [etat, action, enCours] = useActionState(creerCategorie, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
    }
  }, [etat]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3 border-l-4 border-marge-registre p-4">
      <div className="flex flex-col">
        <label htmlFor="nom-categorie" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Nom
        </label>
        <input
          id="nom-categorie"
          name="nom"
          type="text"
          required
          maxLength={80}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="type-categorie" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Type
        </label>
        <select
          id="type-categorie"
          name="type"
          required
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        >
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="couleur-categorie" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Couleur
        </label>
        <select
          id="couleur-categorie"
          name="couleur"
          required
          defaultValue={PALETTE_SUGGEREE[0].valeur}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        >
          {PALETTE_SUGGEREE.map((couleur) => (
            <option key={couleur.valeur} value={couleur.valeur}>
              {couleur.nom}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={enCours}
        className="bg-texte-principal px-4 py-1.5 font-sans text-sm font-semibold text-papier-registre disabled:opacity-60 dark:bg-texte-inverse dark:text-encre-nuit"
      >
        {enCours ? 'Ajout...' : 'Ajouter une catégorie'}
      </button>

      {etat && !etat.success && (
        <p role="alert" className="w-full font-sans text-sm font-medium text-encre-debit">
          {etat.error.message}
        </p>
      )}
    </form>
  );
}
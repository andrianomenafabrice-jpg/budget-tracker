'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type Categorie = { id: string; nom: string };

export function FiltresTransactions({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function mettreAJourFiltre(cle: string, valeur: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valeur) {
      params.set(cle, valeur);
    } else {
      params.delete(cle);
    }
    params.set('page', '1'); // tout changement de filtre repart à la page 1
    router.push(`${pathname}?${params.toString()}`);
  }

  const aDesFiltresActifs =
    searchParams.get('categoryId') || searchParams.get('type') || searchParams.get('dateDebut') || searchParams.get('dateFin');

  return (
    <div className="flex flex-wrap items-end gap-3 border-l-4 border-marge-registre p-4">
      <div className="flex flex-col">
        <label htmlFor="filtre-categorie" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Catégorie
        </label>
        <select
          id="filtre-categorie"
          defaultValue={searchParams.get('categoryId') ?? ''}
          onChange={(evenement) => mettreAJourFiltre('categoryId', evenement.target.value)}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        >
          <option value="">Toutes</option>
          {categories.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="filtre-type" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Type
        </label>
        <select
          id="filtre-type"
          defaultValue={searchParams.get('type') ?? ''}
          onChange={(evenement) => mettreAJourFiltre('type', evenement.target.value)}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-sans text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        >
          <option value="">Tous</option>
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="filtre-debut" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Du
        </label>
        <input
          id="filtre-debut"
          type="date"
          defaultValue={searchParams.get('dateDebut') ?? ''}
          onChange={(evenement) => mettreAJourFiltre('dateDebut', evenement.target.value)}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-mono text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="filtre-fin" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
          Au
        </label>
        <input
          id="filtre-fin"
          type="date"
          defaultValue={searchParams.get('dateFin') ?? ''}
          onChange={(evenement) => mettreAJourFiltre('dateFin', evenement.target.value)}
          className="mt-1 border border-texte-principal/30 bg-transparent px-2 py-1 font-mono text-sm text-texte-principal dark:border-texte-inverse/30 dark:text-texte-inverse"
        />
      </div>

      {aDesFiltresActifs && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="font-sans text-xs text-texte-principal/60 underline hover:text-encre-debit dark:text-texte-inverse/60"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
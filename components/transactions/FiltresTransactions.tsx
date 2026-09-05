'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChampSelect } from '@/components/ui/ChampSelect';
import { Champ } from '@/components/ui/Champ';

type Categorie = { id: string; nom: string };

export function FiltresTransactions({ categories }: { categories: Categorie[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function mettreAJourFiltre(cle: string, valeur: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valeur) params.set(cle, valeur);
    else params.delete(cle);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  const aDesFiltresActifs =
    searchParams.get('categoryId') || searchParams.get('type') || searchParams.get('dateDebut') || searchParams.get('dateFin');

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-texte-principal/10 pb-5 sm:grid-cols-2 lg:grid-cols-5 dark:border-texte-inverse/10">
      <ChampSelect
        label="Catégorie"
        defaultValue={searchParams.get('categoryId') ?? ''}
        onChange={(e) => mettreAJourFiltre('categoryId', e.target.value)}
      >
        <option value="">Toutes</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nom}
          </option>
        ))}
      </ChampSelect>

      <ChampSelect label="Type" defaultValue={searchParams.get('type') ?? ''} onChange={(e) => mettreAJourFiltre('type', e.target.value)}>
        <option value="">Tous</option>
        <option value="depense">Dépense</option>
        <option value="revenu">Revenu</option>
      </ChampSelect>

      <Champ
        label="Du"
        type="date"
        defaultValue={searchParams.get('dateDebut') ?? ''}
        onChange={(e) => mettreAJourFiltre('dateDebut', e.target.value)}
      />
      <Champ
        label="Au"
        type="date"
        defaultValue={searchParams.get('dateFin') ?? ''}
        onChange={(e) => mettreAJourFiltre('dateFin', e.target.value)}
      />

      {aDesFiltresActifs && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="self-end pb-2 font-sans text-sm text-texte-principal/60 underline hover:text-encre-debit dark:text-texte-inverse/60"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}
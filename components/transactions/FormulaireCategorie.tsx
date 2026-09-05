'use client';

import { useActionState, useEffect, useRef } from 'react';
import { creerCategorie } from '@/lib/actions/categorie.actions';
import { Champ } from '@/components/ui/Champ';
import { ChampSelect } from '@/components/ui/ChampSelect';
import { Bouton } from '@/components/ui/Bouton';
import { useToast } from '@/components/ui/ToastProvider';

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
  const afficherToast = useToast();

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
      afficherToast('Catégorie ajoutée');
    }
  }, [etat, afficherToast]);

  return (
    <form ref={formRef} action={action} className="surface-carte p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Champ label="Nom" name="nom" type="text" required maxLength={80} placeholder="Alimentation, loisirs..." />
        <ChampSelect label="Type" name="type" required defaultValue="depense">
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </ChampSelect>
        <ChampSelect label="Couleur" name="couleur" required defaultValue={PALETTE_SUGGEREE[0].valeur}>
          {PALETTE_SUGGEREE.map((couleur) => (
            <option key={couleur.valeur} value={couleur.valeur}>
              {couleur.nom}
            </option>
          ))}
        </ChampSelect>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Bouton type="submit" disabled={enCours} variante="discrete">
          {enCours ? 'Ajout...' : 'Ajouter une catégorie'}
        </Bouton>
        {etat && !etat.success && (
          <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
            {etat.error.message}
          </p>
        )}
      </div>
    </form>
  );
}
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { creerObjectif } from '@/lib/actions/objectif.actions';
import { Champ } from '@/components/ui/Champ';
import { Bouton } from '@/components/ui/Bouton';
import { useToast } from '@/components/ui/ToastProvider';

export function FormulaireObjectif() {
  const [etat, action, enCours] = useActionState(creerObjectif, null);
  const formRef = useRef<HTMLFormElement>(null);
  const afficherToast = useToast();

  useEffect(() => {
    if (etat?.success) {
      formRef.current?.reset();
      afficherToast('Objectif créé');
    }
  }, [etat, afficherToast]);

  return (
    <form ref={formRef} action={action} className="surface-carte p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Champ label="Nom" name="nom" type="text" required maxLength={120} placeholder="Vacances, fonds d'urgence..." />
        <Champ label="Montant cible" name="montantCible" type="text" inputMode="decimal" required placeholder="1000.00" />
        <Champ label="Date limite (optionnelle)" name="dateLimite" type="date" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Bouton type="submit" disabled={enCours} variante="discrete">
          {enCours ? 'Création...' : 'Créer un objectif'}
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
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { transactionSchema } from '@/lib/validations/transaction.schema';
import { creerTransaction } from '@/lib/actions/transaction.actions';
import { Champ } from '@/components/ui/Champ';
import { ChampSelect } from '@/components/ui/ChampSelect';
import { Bouton } from '@/components/ui/Bouton';
import { useToast } from '@/components/ui/ToastProvider';

type FormulaireTransactionInput = z.infer<typeof transactionSchema>;
type Categorie = { id: string; nom: string; type: 'depense' | 'revenu'; couleur: string };

export function FormulaireTransaction({ categories }: { categories: Categorie[] }) {
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const afficherToast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireTransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { date: new Date() },
  });

  async function onSubmit(donnees: FormulaireTransactionInput) {
    setErreurServeur(null);
    const formData = new FormData();
    formData.set('categoryId', donnees.categoryId);
    formData.set('montant', donnees.montant);
    formData.set('description', donnees.description ?? '');
    formData.set('date', new Date(donnees.date).toISOString());

    const resultat = await creerTransaction(null, formData);
    if (!resultat.success) {
      setErreurServeur(resultat.error.message);
      return;
    }
    reset({ categoryId: '', montant: '', description: '', date: new Date() });
    afficherToast('Transaction ajoutée');
  }

  if (categories.length === 0) {
    return (
      <p className="surface-carte p-4 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
        Ajoute d’abord une catégorie pour pouvoir enregistrer une transaction.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface-carte space-y-4 p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Champ
          label="Montant"
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          autoFocus
          erreur={errors.montant?.message}
          {...register('montant')}
        />
        <ChampSelect label="Catégorie" {...register('categoryId')}>
          <option value="">— Choisir —</option>
          {categories.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.nom} ({categorie.type === 'revenu' ? '+' : '−'})
            </option>
          ))}
        </ChampSelect>
        <Champ label="Description" type="text" placeholder="Optionnelle" {...register('description')} />
        <Champ
          label="Date"
          type="date"
          erreur={errors.date ? 'Date invalide' : undefined}
          {...register('date', { valueAsDate: true })}
        />
      </div>

      {errors.categoryId && <p className="font-sans text-xs text-encre-debit">{errors.categoryId.message}</p>}
      {erreurServeur && (
        <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
          {erreurServeur}
        </p>
      )}

      <Bouton type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Ajout...' : 'Ajouter une transaction'}
      </Bouton>
    </form>
  );
}
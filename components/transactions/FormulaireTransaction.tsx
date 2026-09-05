'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { transactionSchema } from '@/lib/validations/transaction.schema';
import { creerTransaction } from '@/lib/actions/transaction.actions';

type FormulaireTransactionInput = z.infer<typeof transactionSchema>;

type Categorie = {
  id: string;
  nom: string;
  type: 'depense' | 'revenu';
  couleur: string;
};

export function FormulaireTransaction({ categories }: { categories: Categorie[] }) {
  const [erreurServeur, setErreurServeur] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormulaireTransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
    },
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
  }

  if (categories.length === 0) {
    return (
      <p className="border-l-4 border-marge-registre p-4 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
        Ajoute d’abord une catégorie pour pouvoir enregistrer une transaction.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-l-4 border-marge-registre p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="montant" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
            Montant
          </label>
          <input
            id="montant"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            autoFocus
            {...register('montant')}
            className="mt-1 w-full border border-texte-principal/30 bg-transparent px-2 py-1.5 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
          />
          {errors.montant && <p className="mt-1 text-xs text-encre-debit">{errors.montant.message}</p>}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="categoryId" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
            Catégorie
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            className="mt-1 w-full border border-texte-principal/30 bg-transparent px-2 py-1.5 font-sans text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
          >
            <option value="">— Choisir —</option>
            {categories.map((categorie) => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom} ({categorie.type === 'revenu' ? '+' : '−'})
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs text-encre-debit">{errors.categoryId.message}</p>}
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
            Description (optionnelle)
          </label>
          <input
            id="description"
            type="text"
            {...register('description')}
            className="mt-1 w-full border border-texte-principal/30 bg-transparent px-2 py-1.5 font-sans text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
          />
        </div>

        <div className="col-span-2 sm:col-span-2">
          <label htmlFor="date" className="font-sans text-xs font-medium text-texte-principal dark:text-texte-inverse">
            Date
          </label>
          <input
            id="date"
            type="date"
            {...register('date', { valueAsDate: true })}
            className="mt-1 w-full border border-texte-principal/30 bg-transparent px-2 py-1.5 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
          />
          {errors.date && <p className="mt-1 text-xs text-encre-debit">Date invalide</p>}
        </div>
      </div>

      {erreurServeur && (
        <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
          {erreurServeur}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-encre-objectif px-4 py-2 font-sans text-sm font-semibold text-texte-inverse disabled:opacity-60"
      >
        {isSubmitting ? 'Ajout...' : 'Ajouter une dépense'}
      </button>
    </form>
  );
}
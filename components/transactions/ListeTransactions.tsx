'use client';

import { useTransition } from 'react';
import { supprimerTransaction } from '@/lib/actions/transaction.actions';

type TransactionAffichee = {
  id: string;
  type: 'depense' | 'revenu';
  montant: string;
  description: string | null;
  date: Date;
  categorieNom: string;
  categorieCouleur: string;
};

export function ListeTransactions({ transactions }: { transactions: TransactionAffichee[] }) {
  const [enSuppression, demarrerSuppression] = useTransition();

  function gererSuppression(id: string) {
    if (!window.confirm('Supprimer définitivement cette transaction ?')) return;
    demarrerSuppression(async () => {
      await supprimerTransaction(id);
    });
  }

  if (transactions.length === 0) {
    return (
      <p className="border-l-4 border-marge-registre p-4 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
        Aucune transaction pour l’instant. Ajoute ta première dépense ou ton premier revenu ci-dessus.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-texte-principal/10 dark:divide-texte-inverse/10">
      {transactions.map((transaction) => {
        const signe = transaction.type === 'revenu' ? '+' : '−';
        const couleurMontant = transaction.type === 'revenu' ? 'text-encre-credit' : 'text-encre-debit';

        return (
          <li key={transaction.id} className="flex items-center gap-4 border-l-4 border-marge-registre py-3 pl-4">
            <span className="w-24 shrink-0 font-mono text-xs text-texte-principal/70 dark:text-texte-inverse/70">
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex-1 font-sans text-sm text-texte-principal dark:text-texte-inverse">
              {transaction.description || transaction.categorieNom}
              <span className="ml-2 text-xs text-texte-principal/60 dark:text-texte-inverse/60">
                {transaction.categorieNom}
              </span>
            </span>
            <span className={`font-mono text-sm font-semibold tabular-nums ${couleurMontant}`}>
              {signe}
              {transaction.montant} €
            </span>
            <button
              type="button"
              onClick={() => gererSuppression(transaction.id)}
              disabled={enSuppression}
              className="font-sans text-xs text-texte-principal/50 hover:text-encre-debit disabled:opacity-40 dark:text-texte-inverse/50"
            >
              Supprimer
            </button>
          </li>
        );
      })}
    </ul>
  );
}
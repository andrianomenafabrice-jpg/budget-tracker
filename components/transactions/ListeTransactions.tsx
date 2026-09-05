'use client';

import { useTransition } from 'react';
import { supprimerTransaction } from '@/lib/actions/transaction.actions';
import { useConfirmation } from '@/components/ui/ConfirmProvider';
import { useToast } from '@/components/ui/ToastProvider';

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
  const demanderConfirmation = useConfirmation();
  const afficherToast = useToast();
  const [enSuppression, demarrerSuppression] = useTransition();

  async function gererSuppression(id: string) {
    const confirme = await demanderConfirmation('Supprimer définitivement cette transaction ?');
    if (!confirme) return;

    demarrerSuppression(async () => {
      const resultat = await supprimerTransaction(id);
      afficherToast(resultat.success ? 'Transaction supprimée' : resultat.error.message, resultat.success ? 'succes' : 'erreur');
    });
  }

  if (transactions.length === 0) {
    return (
      <p className="surface-carte p-4 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
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
          <li
            key={transaction.id}
            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4 sm:border-l-2 sm:border-marge-registre sm:pl-4"
          >
            <span className="w-24 shrink-0 font-mono text-xs text-texte-principal/60 dark:text-texte-inverse/60">
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex-1 font-sans text-sm text-texte-principal dark:text-texte-inverse">
              {transaction.description || transaction.categorieNom}
              <span
                className="ml-2 rounded-full px-2 py-0.5 text-xs text-texte-inverse"
                style={{ backgroundColor: transaction.categorieCouleur }}
              >
                {transaction.categorieNom}
              </span>
            </span>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}
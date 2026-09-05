import type { AgregationMensuelle } from '@/lib/services/agregation.service';

export function CarteSolde({ agregation }: { agregation: AgregationMensuelle }) {
  const positif = agregation.solde >= 0;

  return (
    <div className="surface-carte p-5 sm:p-6">
      <p className="font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">Solde du mois</p>
      <p className={`font-mono text-4xl font-bold tabular-nums ${positif ? 'text-encre-credit' : 'text-encre-debit'}`}>
        {positif ? '+' : ''}
        {agregation.solde.toFixed(2)} €
      </p>
      <div className="mt-4 flex gap-8">
        <div>
          <p className="font-sans text-xs text-texte-principal/60 dark:text-texte-inverse/60">Revenus</p>
          <p className="font-mono text-sm font-semibold tabular-nums text-encre-credit">+{agregation.totalRevenus.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-sans text-xs text-texte-principal/60 dark:text-texte-inverse/60">Dépenses</p>
          <p className="font-mono text-sm font-semibold tabular-nums text-encre-debit">−{agregation.totalDepenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
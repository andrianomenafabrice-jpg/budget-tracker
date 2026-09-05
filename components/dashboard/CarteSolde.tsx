import type { AgregationMensuelle } from '@/lib/services/agregation.service';

export function CarteSolde({ agregation }: { agregation: AgregationMensuelle }) {
  const positif = agregation.solde >= 0;

  return (
    <div className="border-l-4 border-marge-registre p-6">
      <p className="font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">Solde du mois</p>
      <p className={`font-mono text-4xl font-bold tabular-nums ${positif ? 'text-encre-credit' : 'text-encre-debit'}`}>
        {positif ? '+' : ''}
        {agregation.solde.toFixed(2)} €
      </p>
      <p className="mt-2 font-mono text-sm tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
        Revenus <span className="text-encre-credit">+{agregation.totalRevenus.toFixed(2)}</span>
        {'  ·  '}
        Dépenses <span className="text-encre-debit">−{agregation.totalDepenses.toFixed(2)}</span>
      </p>
    </div>
  );
}
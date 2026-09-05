'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type { AgregationMensuelle } from '@/lib/services/agregation.service';

function formaterMoisCourt(mois: string): string {
  const [annee, moisNum] = mois.split('-').map(Number);
  const date = new Date(Date.UTC(annee, moisNum - 1, 1));
  return date.toLocaleDateString('fr-FR', { month: 'short', timeZone: 'UTC' });
}

function InfobulleGraphique({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-texte-principal/30 bg-papier-registre px-3 py-2 font-mono text-xs dark:bg-encre-nuit">
      <p className="mb-1 font-sans font-semibold text-texte-principal dark:text-texte-inverse">
        {formaterMoisCourt(String(label))}
      </p>
      {payload.map((entree) => (
        <p key={entree.dataKey} style={{ color: entree.color }} className="tabular-nums">
          {entree.name} : {Number(entree.value).toFixed(2)} €
        </p>
      ))}
    </div>
  );
}

export function GraphiqueEvolution({ donnees }: { donnees: AgregationMensuelle[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={donnees} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-graphique-texte)" strokeOpacity={0.1} />
        <XAxis
          dataKey="mois"
          tickFormatter={formaterMoisCourt}
          stroke="var(--color-graphique-texte)"
          fontSize={12}
          fontFamily="var(--font-mono)"
        />
        <YAxis stroke="var(--color-graphique-texte)" fontSize={12} fontFamily="var(--font-mono)" />
        <Tooltip content={<InfobulleGraphique />} />
        <Line type="monotone" dataKey="totalRevenus" name="Revenus" stroke="var(--color-encre-credit)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="totalDepenses" name="Dépenses" stroke="var(--color-encre-debit)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="solde" name="Solde" stroke="var(--color-encre-objectif)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
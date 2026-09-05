'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { RepartitionCategorie } from '@/lib/services/agregation.service';

function InfobulleRepartition({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const donnee = payload[0].payload as RepartitionCategorie;

  return (
    <div className="border border-texte-principal/30 bg-papier-registre px-3 py-2 font-mono text-xs dark:bg-encre-nuit">
      <p className="font-sans font-semibold text-texte-principal dark:text-texte-inverse">{donnee.nom}</p>
      <p className="tabular-nums text-texte-principal dark:text-texte-inverse">{donnee.montant.toFixed(2)} €</p>
    </div>
  );
}

export function GraphiqueRepartition({ donnees }: { donnees: RepartitionCategorie[] }) {
  if (donnees.length === 0) {
    return (
      <p className="flex h-[280px] items-center justify-center font-sans text-sm text-texte-principal/60 dark:text-texte-inverse/60">
        Aucune dépense ce mois-ci.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={donnees} dataKey="montant" nameKey="nom" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {donnees.map((entree) => (
            <Cell key={entree.categorieId} fill={entree.couleur} />
          ))}
        </Pie>
        <Tooltip content={<InfobulleRepartition />} />
        <Legend
          verticalAlign="middle"
          align="right"
          layout="vertical"
          iconType="square"
          wrapperStyle={{ fontFamily: 'var(--font-sans)', fontSize: 13 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
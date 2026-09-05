'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { exporterTransactionsCsv } from '@/lib/actions/export.actions';
import { useToast } from '@/components/ui/ToastProvider';

export function BoutonExportCsv() {
  const searchParams = useSearchParams();
  const afficherToast = useToast();
  const [enCours, setEnCours] = useState(false);

  async function gererExport() {
    setEnCours(true);
    try {
      const resultat = await exporterTransactionsCsv({
        categoryId: searchParams.get('categoryId') ?? undefined,
        type: (searchParams.get('type') as 'depense' | 'revenu' | null) ?? undefined,
        dateDebut: searchParams.get('dateDebut') ?? undefined,
        dateFin: searchParams.get('dateFin') ?? undefined,
      });

      if (!resultat.success) {
        afficherToast(resultat.error.message, 'erreur');
        return;
      }

      const BOM_UTF8 = '\uFEFF';
      const blob = new Blob([BOM_UTF8 + resultat.data.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const lien = document.createElement('a');
      lien.href = url;
      lien.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      lien.click();
      URL.revokeObjectURL(url);
      afficherToast('Export téléchargé');
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      type="button"
      onClick={gererExport}
      disabled={enCours}
      className="font-sans text-xs text-texte-principal/70 underline hover:text-encre-objectif disabled:opacity-50 dark:text-texte-inverse/70"
    >
      {enCours ? 'Export...' : 'Exporter en CSV'}
    </button>
  );
}
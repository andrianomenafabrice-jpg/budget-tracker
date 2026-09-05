'use client';

function formaterLibelleMois(mois: string): string {
  const [annee, moisNum] = mois.split('-').map(Number);
  const date = new Date(Date.UTC(annee, moisNum - 1, 1));
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function SelecteurMois({
  moisDisponibles,
  moisSelectionne,
  onChange,
}: {
  moisDisponibles: string[];
  moisSelectionne: string;
  onChange: (mois: string) => void;
}) {
  return (
    <select
      value={moisSelectionne}
      onChange={(evenement) => onChange(evenement.target.value)}
      className="border border-texte-principal/30 bg-transparent px-3 py-1.5 font-sans text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
    >
      {moisDisponibles.map((mois) => (
        <option key={mois} value={mois}>
          {formaterLibelleMois(mois)}
        </option>
      ))}
    </select>
  );
}
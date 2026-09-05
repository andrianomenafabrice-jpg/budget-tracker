import { calculerProgressionObjectif } from '@/lib/services/objectif.service';

const NOMBRE_SEGMENTS = 20;

export function JaugeObjectif({ montantActuel, montantCible }: { montantActuel: string; montantCible: string }) {
  const { pourcentage, atteint } = calculerProgressionObjectif({ montantActuel, montantCible });
  const segmentsRemplis = Math.round((pourcentage / 100) * NOMBRE_SEGMENTS);
  const couleur = atteint ? 'bg-encre-credit' : 'bg-encre-objectif';

  return (
    <div>
      <div className="flex gap-0.5">
        {Array.from({ length: NOMBRE_SEGMENTS }).map((_, i) => (
          <span
            key={i}
            className={`h-3.5 flex-1 sm:h-4 ${i < segmentsRemplis ? couleur : 'bg-texte-principal/10 dark:bg-texte-inverse/10'}`}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-xs tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
        {`${pourcentage.toFixed(0)} %${atteint ? ' — Objectif atteint !' : ''}`}
      </p>
    </div>
  );
}
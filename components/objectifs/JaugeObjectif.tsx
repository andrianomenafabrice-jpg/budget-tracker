import { calculerProgressionObjectif } from '@/lib/services/objectif.service';

const NOMBRE_SEGMENTS = 20;

export function JaugeObjectif({
  montantActuel,
  montantCible,
}: {
  montantActuel: string;
  montantCible: string;
}) {
  const { pourcentage, atteint } = calculerProgressionObjectif({ montantActuel, montantCible });
  const segmentsRemplis = Math.round((pourcentage / 100) * NOMBRE_SEGMENTS);
  const couleur = atteint ? 'bg-encre-credit' : 'bg-encre-objectif';

  return (
    <div>
      <div className="flex gap-0.5">
        {Array.from({ length: NOMBRE_SEGMENTS }).map((_, index) => (
          <span
            key={index}
            className={`h-4 flex-1 ${index < segmentsRemplis ? couleur : 'bg-texte-principal/10 dark:bg-texte-inverse/10'}`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-texte-principal/50 dark:text-texte-inverse/50">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
      <p className="mt-1 font-mono text-xs tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
        {pourcentage.toFixed(0)} %{atteint && ' — Objectif atteint !'}
      </p>
    </div>
  );
}
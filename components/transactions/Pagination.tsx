import Link from 'next/link';

function genererNumerosPage(pageActuelle: number, totalPages: number): (number | 'ellipse')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, pageActuelle, pageActuelle - 1, pageActuelle + 1]);
  const pagesTriees = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);

  const resultat: (number | 'ellipse')[] = [];
  pagesTriees.forEach((page, index) => {
    if (index > 0 && page - pagesTriees[index - 1] > 1) {
      resultat.push('ellipse');
    }
    resultat.push(page);
  });
  return resultat;
}

export function Pagination({
  pageActuelle,
  totalPages,
  parametresActuels,
}: {
  pageActuelle: number;
  totalPages: number;
  parametresActuels: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function lienPage(page: number): string {
    const params = new URLSearchParams();
    Object.entries(parametresActuels).forEach(([cle, valeur]) => {
      if (valeur && cle !== 'page') params.set(cle, valeur);
    });
    params.set('page', String(page));
    return `?${params.toString()}`;
  }

  return (
    <nav className="flex items-center gap-3 font-mono text-sm">
      <Link
        href={lienPage(Math.max(1, pageActuelle - 1))}
        aria-disabled={pageActuelle === 1}
        className={pageActuelle === 1 ? 'pointer-events-none text-texte-principal/30' : 'text-texte-principal hover:underline dark:text-texte-inverse'}
      >
        ← Précédent
      </Link>

      <div className="flex items-center gap-2">
        {genererNumerosPage(pageActuelle, totalPages).map((page, index) =>
          page === 'ellipse' ? (
            <span key={`ellipse-${index}`} className="text-texte-principal/40">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={lienPage(page)}
              className={
                page === pageActuelle
                  ? 'font-bold text-encre-objectif underline'
                  : 'text-texte-principal/60 hover:underline dark:text-texte-inverse/60'
              }
            >
              {page}
            </Link>
          )
        )}
      </div>

      <Link
        href={lienPage(Math.min(totalPages, pageActuelle + 1))}
        aria-disabled={pageActuelle === totalPages}
        className={pageActuelle === totalPages ? 'pointer-events-none text-texte-principal/30' : 'text-texte-principal hover:underline dark:text-texte-inverse'}
      >
        Suivant →
      </Link>
    </nav>
  );
}
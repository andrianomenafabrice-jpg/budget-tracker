/**
 * Convertit un montant Postgres `numeric` (toujours une chaîne, ex. "19.99")
 * en centimes entiers, sans jamais passer par une multiplication flottante.
 * Hypothèse : l'entrée provient d'une colonne numeric(12,2) — toujours 0 à 2
 * décimales, jamais de dérive flottante à absorber en amont.
 */
export function versCentimes(valeur: string | number): number {
  const chaine = String(valeur).trim();
  const negatif = chaine.startsWith('-');
  const sansSigne = negatif ? chaine.slice(1) : chaine;
  const [partieEntiere, partieDecimale = ''] = sansSigne.split('.');

  const decimalesNormalisees = (partieDecimale + '00').slice(0, 2);
  const entier = Number(partieEntiere || '0');
  const decimales = Number(decimalesNormalisees || '0');

  if (Number.isNaN(entier) || Number.isNaN(decimales)) {
    throw new Error(`Montant invalide, impossible de convertir en centimes : "${valeur}"`);
  }

  const centimes = entier * 100 + decimales;
  return negatif ? -centimes : centimes;
}

/**
 * Reformate des centimes entiers en chaîne à 2 décimales (ex. 1999 → "19.99").
 * Opération inverse de versCentimes, toujours en fin de calcul.
 */
export function versAffichage(centimes: number): string {
  const negatif = centimes < 0;
  const abs = Math.abs(Math.round(centimes));
  const entier = Math.floor(abs / 100);
  const decimales = abs % 100;
  return `${negatif ? '-' : ''}${entier}.${decimales.toString().padStart(2, '0')}`;
}

/**
 * Reconvertit des centimes en nombre JS (pour l'affichage / les graphiques),
 * en repassant par versAffichage pour garantir un résultat exact au centime.
 */
export function centimesVersNombre(centimes: number): number {
  return Number(versAffichage(centimes));
}
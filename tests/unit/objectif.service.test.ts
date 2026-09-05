import { calculerProgressionObjectif } from '@/lib/services/objectif.service';

describe('calculerProgressionObjectif', () => {
  it('plafonne le pourcentage à 100 quand montantActuel dépasse montantCible', () => {
    const resultat = calculerProgressionObjectif({ montantActuel: '1200.00', montantCible: '1000.00' });

    expect(resultat.pourcentage).toBe(100);
    expect(resultat.atteint).toBe(true);
  });

  it('ne divise jamais par zéro quand montantCible vaut 0', () => {
    const sansMontant = calculerProgressionObjectif({ montantActuel: '0.00', montantCible: '0.00' });
    expect(Number.isFinite(sansMontant.pourcentage)).toBe(true);
    expect(sansMontant.pourcentage).toBe(0);
    expect(sansMontant.atteint).toBe(false);

    const avecMontant = calculerProgressionObjectif({ montantActuel: '50.00', montantCible: '0.00' });
    expect(Number.isFinite(avecMontant.pourcentage)).toBe(true);
    expect(avecMontant.atteint).toBe(true);
  });

  it('plancher le pourcentage à 0 quand montantActuel est négatif (cas défensif)', () => {
    const resultat = calculerProgressionObjectif({ montantActuel: '-50.00', montantCible: '1000.00' });

    expect(resultat.pourcentage).toBe(0);
    expect(resultat.atteint).toBe(false);
  });

  it('calcule un pourcentage intermédiaire correct', () => {
    const resultat = calculerProgressionObjectif({ montantActuel: '250.00', montantCible: '1000.00' });

    expect(resultat.pourcentage).toBe(25);
    expect(resultat.atteint).toBe(false);
  });
});
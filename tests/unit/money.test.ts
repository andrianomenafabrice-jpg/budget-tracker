import { versCentimes, versAffichage, centimesVersNombre } from '@/lib/utils/money';

describe('versCentimes', () => {
  it('convertit une chaîne numeric Postgres en centimes entiers', () => {
    expect(versCentimes('19.99')).toBe(1999);
    expect(versCentimes('5.01')).toBe(501);
    expect(versCentimes('100')).toBe(10000);
    expect(versCentimes('0.00')).toBe(0);
  });

  it('gère les montants négatifs', () => {
    expect(versCentimes('-50.00')).toBe(-5000);
  });
});

describe('versAffichage', () => {
  it('reformate des centimes en chaîne à 2 décimales', () => {
    expect(versAffichage(1999)).toBe('19.99');
    expect(versAffichage(0)).toBe('0.00');
    expect(versAffichage(-5000)).toBe('-50.00');
  });
});

describe('centimesVersNombre', () => {
  it('additionne 0.10 et 0.20 sans dérive flottante une fois passé par les centimes', () => {
    const centimes = versCentimes('0.10') + versCentimes('0.20');
    expect(centimesVersNombre(centimes)).toBe(0.3);
  });
});
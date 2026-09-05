import {
  calculerAgregationMensuelle,
  calculerRepartitionParCategorie,
  type TransactionPourCalcul,
  type CategoriePourCalcul,
} from '@/lib/services/agregation.service';

function creerTransaction(overrides: Partial<TransactionPourCalcul>): TransactionPourCalcul {
  return {
    categoryId: 'cat-1',
    type: 'depense',
    montant: '10.00',
    date: new Date('2025-06-15T12:00:00Z'),
    ...overrides,
  };
}

describe('calculerAgregationMensuelle', () => {
  it('retourne des totaux à 0 pour une liste vide, sans erreur', () => {
    const resultat = calculerAgregationMensuelle([], '2025-06');

    expect(resultat).toEqual({
      mois: '2025-06',
      totalRevenus: 0,
      totalDepenses: 0,
      solde: 0,
    });
  });

  it('calcule un solde correct sur un mélange dépenses/revenus du même mois', () => {
    const transactions: TransactionPourCalcul[] = [
      creerTransaction({ type: 'revenu', montant: '1500.00' }),
      creerTransaction({ type: 'depense', montant: '600.50' }),
      creerTransaction({ type: 'depense', montant: '99.50' }),
    ];

    const resultat = calculerAgregationMensuelle(transactions, '2025-06');

    expect(resultat.totalRevenus).toBe(1500);
    expect(resultat.totalDepenses).toBe(700);
    expect(resultat.solde).toBe(800);
  });

  it("exclut les transactions hors du mois demandé, y compris à cheval sur un changement d'année", () => {
    const transactions: TransactionPourCalcul[] = [
      creerTransaction({ type: 'revenu', montant: '100.00', date: new Date('2024-12-31T23:59:59Z') }),
      creerTransaction({ type: 'revenu', montant: '200.00', date: new Date('2025-01-01T00:00:00Z') }),
      creerTransaction({ type: 'revenu', montant: '300.00', date: new Date('2025-01-31T23:59:59Z') }),
      creerTransaction({ type: 'revenu', montant: '400.00', date: new Date('2025-02-01T00:00:00Z') }),
    ];

    const resultat = calculerAgregationMensuelle(transactions, '2025-01');

    expect(resultat.totalRevenus).toBe(500);
  });

  it('additionne des montants avec décimales sans dérive flottante', () => {
    const transactions: TransactionPourCalcul[] = [
      creerTransaction({ type: 'depense', montant: '19.99' }),
      creerTransaction({ type: 'depense', montant: '5.01' }),
    ];

    const resultat = calculerAgregationMensuelle(transactions, '2025-06');

    expect(resultat.totalDepenses).toBe(25);
  });
});

describe('calculerRepartitionParCategorie', () => {
  it('regroupe les montants par catégorie pour le mois demandé', () => {
    const categories: CategoriePourCalcul[] = [
      { id: 'cat-1', nom: 'Alimentation', couleur: '#4F6B4A' },
      { id: 'cat-2', nom: 'Loisirs', couleur: '#5B4566' },
    ];
    const transactions: TransactionPourCalcul[] = [
      creerTransaction({ categoryId: 'cat-1', montant: '50.00' }),
      creerTransaction({ categoryId: 'cat-1', montant: '30.00' }),
      creerTransaction({ categoryId: 'cat-2', montant: '20.00' }),
      creerTransaction({ categoryId: 'cat-2', montant: '20.00', date: new Date('2025-07-01T00:00:00Z') }),
    ];

    const resultat = calculerRepartitionParCategorie(transactions, categories, '2025-06');

    expect(resultat).toEqual(
      expect.arrayContaining([
        { categorieId: 'cat-1', nom: 'Alimentation', couleur: '#4F6B4A', montant: 80 },
        { categorieId: 'cat-2', nom: 'Loisirs', couleur: '#5B4566', montant: 20 },
      ])
    );
    expect(resultat).toHaveLength(2);
  });

  it('exclut les catégories sans transaction sur le mois demandé', () => {
    const categories: CategoriePourCalcul[] = [
      { id: 'cat-1', nom: 'Alimentation', couleur: '#4F6B4A' },
      { id: 'cat-2', nom: 'Loisirs', couleur: '#5B4566' },
    ];
    const transactions: TransactionPourCalcul[] = [creerTransaction({ categoryId: 'cat-1', montant: '10.00' })];

    const resultat = calculerRepartitionParCategorie(transactions, categories, '2025-06');

    expect(resultat).toEqual([{ categorieId: 'cat-1', nom: 'Alimentation', couleur: '#4F6B4A', montant: 10 }]);
  });
});


import { calculerEvolutionMensuelle, derniersMois } from '@/lib/services/agregation.service';

describe('derniersMois', () => {
  it('génère les 3 derniers mois dans l’ordre chronologique, du plus ancien au plus récent', () => {
    const reference = new Date('2025-06-15T00:00:00Z');
    expect(derniersMois(3, reference)).toEqual(['2025-04', '2025-05', '2025-06']);
  });

  it('gère correctement le passage à l’année précédente', () => {
    const reference = new Date('2025-02-10T00:00:00Z');
    expect(derniersMois(3, reference)).toEqual(['2024-12', '2025-01', '2025-02']);
  });
});

describe('calculerEvolutionMensuelle', () => {
  it('retourne une agrégation par mois, y compris des mois sans aucune transaction', () => {
    const reference = new Date('2025-06-15T00:00:00Z');
    const transactions: TransactionPourCalcul[] = [
      {
        categoryId: 'cat-1',
        type: 'revenu',
        montant: '1000.00',
        date: new Date('2025-06-05T00:00:00Z'),
      },
    ];

    const resultat = calculerEvolutionMensuelle(transactions, 3, reference);

    expect(resultat).toHaveLength(3);
    expect(resultat[0]).toEqual({ mois: '2025-04', totalRevenus: 0, totalDepenses: 0, solde: 0 });
    expect(resultat[2]).toEqual({ mois: '2025-06', totalRevenus: 1000, totalDepenses: 0, solde: 1000 });
  });
});
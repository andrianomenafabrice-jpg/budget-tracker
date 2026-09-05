import { screen } from '@testing-library/react';
import { renderAvecProviders as render } from '../test-utils';
import { ListeTransactions } from '../../components/transactions/ListeTransactions';

jest.mock('../../lib/actions/transaction.actions', () => ({
  supprimerTransaction: jest.fn(),
}));

describe('ListeTransactions', () => {
  it('affiche un message quand la liste est vide', () => {
    render(<ListeTransactions transactions={[]} />);
    expect(screen.getByText(/Aucune transaction pour l’instant/)).toBeInTheDocument();
  });

  it('affiche le signe + et la couleur crédit pour un revenu', () => {
    render(
      <ListeTransactions
        transactions={[
          {
            id: '1',
            type: 'revenu',
            montant: '1500.00',
            description: 'Salaire',
            date: new Date('2025-06-01'),
            categorieNom: 'Salaire',
            categorieCouleur: '#1E6B4E',
          },
        ]}
      />
    );
    expect(screen.getByText(/\+1500\.00 €/)).toBeInTheDocument();
  });

  it('affiche le signe − pour une dépense', () => {
    render(
      <ListeTransactions
        transactions={[
          {
            id: '2',
            type: 'depense',
            montant: '45.20',
            description: 'Courses',
            date: new Date('2025-06-02'),
            categorieNom: 'Alimentation',
            categorieCouleur: '#4F6B4A',
          },
        ]}
      />
    );
    expect(screen.getByText(/−45\.20 €/)).toBeInTheDocument();
  });
});
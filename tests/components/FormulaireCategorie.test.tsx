import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAvecProviders as render } from '../test-utils';
import { FormulaireCategorie } from '../../components/transactions/FormulaireCategorie';

jest.mock('../../lib/actions/categorie.actions', () => ({
  creerCategorie: jest.fn(),
}));

import { creerCategorie } from '../../lib/actions/categorie.actions';

describe('FormulaireCategorie', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('affiche le message d’erreur retourné par l’action en cas d’échec', async () => {
    (creerCategorie as jest.Mock).mockResolvedValue({
      success: false,
      error: { code: 'NOM_DEJA_UTILISE', message: 'Une catégorie porte déjà ce nom' },
    });

    const utilisateur = userEvent.setup();
    render(<FormulaireCategorie />);

    await utilisateur.type(screen.getByLabelText('Nom'), 'Alimentation');
    await utilisateur.click(screen.getByRole('button', { name: /Ajouter une catégorie/ }));

    expect(await screen.findByText('Une catégorie porte déjà ce nom')).toBeInTheDocument();
  });

  it('propose les options de type dépense et revenu', () => {
    render(<FormulaireCategorie />);
    expect(screen.getByRole('option', { name: 'Dépense' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Revenu' })).toBeInTheDocument();
  });
});
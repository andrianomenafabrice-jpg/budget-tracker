import { render, screen } from '@testing-library/react';
import { JaugeObjectif } from '../../components/objectifs/JaugeObjectif';

describe('JaugeObjectif', () => {
  it('affiche 0 % et aucun segment rempli pour un objectif tout juste créé', () => {
    render(<JaugeObjectif montantActuel="0.00" montantCible="1000.00" />);
    expect(screen.getByText('0 %')).toBeInTheDocument();
    expect(screen.queryByText(/Objectif atteint/)).not.toBeInTheDocument();
  });

  it('affiche le pourcentage correct pour une progression intermédiaire', () => {
    render(<JaugeObjectif montantActuel="250.00" montantCible="1000.00" />);
    expect(screen.getByText('25 %')).toBeInTheDocument();
  });

  it('affiche le message de succès quand l’objectif est atteint', () => {
    render(<JaugeObjectif montantActuel="1200.00" montantCible="1000.00" />);
    expect(screen.getByText(/100 %/)).toBeInTheDocument();
    expect(screen.getByText(/Objectif atteint !/)).toBeInTheDocument();
  });
});
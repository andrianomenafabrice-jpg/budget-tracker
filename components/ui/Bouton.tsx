import { forwardRef, type ButtonHTMLAttributes } from 'react';

type Variante = 'primaire' | 'discrete' | 'danger';

type BoutonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
};

const classesParVariante: Record<Variante, string> = {
  primaire: 'bg-encre-objectif text-texte-inverse hover:bg-encre-objectif/90 px-4 py-2.5',
  discrete:
    'border border-texte-principal/25 text-texte-principal hover:border-texte-principal/50 px-4 py-2.5 dark:border-texte-inverse/25 dark:text-texte-inverse dark:hover:border-texte-inverse/50',
  danger: 'text-encre-debit hover:underline',
};

export const Bouton = forwardRef<HTMLButtonElement, BoutonProps>(
  ({ variante = 'primaire', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`font-sans text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 ${classesParVariante[variante]} ${className}`}
      {...props}
    />
  )
);
Bouton.displayName = 'Bouton';
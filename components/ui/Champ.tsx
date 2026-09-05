import { forwardRef, type InputHTMLAttributes } from 'react';

type ChampProps = InputHTMLAttributes<HTMLInputElement> & { label: string; erreur?: string };

export const Champ = forwardRef<HTMLInputElement, ChampProps>(
  ({ label, erreur, id, className = '', ...props }, ref) => {
    const champId = id ?? `champ-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={champId} className="font-sans text-[13px] font-medium text-texte-principal dark:text-texte-inverse">
          {label}
        </label>
        <input
          id={champId}
          ref={ref}
          className={`border border-texte-principal/25 bg-transparent px-3 py-2 font-mono text-sm text-texte-principal placeholder:text-texte-principal/40 focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/25 dark:text-texte-inverse dark:placeholder:text-texte-inverse/40 ${className}`}
          {...props}
        />
        {erreur && (
          <p role="alert" className="font-sans text-xs text-encre-debit">
            {erreur}
          </p>
        )}
      </div>
    );
  }
);
Champ.displayName = 'Champ';
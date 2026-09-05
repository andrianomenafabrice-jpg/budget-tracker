import { forwardRef, type SelectHTMLAttributes } from 'react';

type ChampSelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string };

export const ChampSelect = forwardRef<HTMLSelectElement, ChampSelectProps>(
  ({ label, id, className = '', children, ...props }, ref) => {
    const champId = id ?? `champ-${label.toLowerCase().replace(/\s+/g, '-')}`;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={champId} className="font-sans text-[13px] font-medium text-texte-principal dark:text-texte-inverse">
          {label}
        </label>
        <select
          id={champId}
          ref={ref}
          className={`border border-texte-principal/25 bg-transparent px-3 py-2 font-sans text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/25 dark:text-texte-inverse ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
ChampSelect.displayName = 'ChampSelect';
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deconnecter } from '@/lib/actions/deconnexion.action';
import { BasculeTheme } from './BasculeTheme';

const LIENS = [
  { href: '/dashboard', label: 'Tableau de bord' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/objectifs', label: 'Objectifs' },
];

export function NavPrincipale() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-texte-principal/15 dark:border-texte-inverse/15">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-display text-xl font-bold text-texte-principal dark:text-texte-inverse">
          Le Grand Livre
        </Link>

        <nav className="hidden items-center gap-6 font-sans text-sm md:flex">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className={
                pathname === lien.href
                  ? 'font-semibold text-encre-objectif'
                  : 'text-texte-principal hover:text-encre-objectif dark:text-texte-inverse'
              }
            >
              {lien.label}
            </Link>
          ))}
          <BasculeTheme />
          <form action={deconnecter}>
            <button type="submit" className="text-encre-debit hover:underline">
              Déconnexion
            </button>
          </form>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <BasculeTheme />
          <button
            type="button"
            onClick={() => setMenuOuvert((valeur) => !valeur)}
            aria-expanded={menuOuvert}
            aria-label="Ouvrir le menu"
            className="text-texte-principal dark:text-texte-inverse"
          >
            {menuOuvert ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOuvert && (
        <nav className="flex flex-col gap-1 border-t border-texte-principal/15 px-6 py-3 font-sans text-sm md:hidden dark:border-texte-inverse/15">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              onClick={() => setMenuOuvert(false)}
              className={`py-2 ${pathname === lien.href ? 'font-semibold text-encre-objectif' : 'text-texte-principal dark:text-texte-inverse'}`}
            >
              {lien.label}
            </Link>
          ))}
          <form action={deconnecter} className="pt-1">
            <button type="submit" className="py-2 text-encre-debit">
              Déconnexion
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
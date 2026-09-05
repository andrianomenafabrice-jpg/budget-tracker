import Link from 'next/link';
import { signOut } from '@/lib/auth';

export default function LayoutTableauDeBord({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-papier-registre dark:bg-encre-nuit">
      <header className="border-b border-texte-principal/20 px-6 py-4 dark:border-texte-inverse/20">
        <nav className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="font-display text-xl font-bold text-texte-principal dark:text-texte-inverse">
            Le Grand Livre
          </Link>
          <div className="flex items-center gap-6 font-sans text-sm">
            <Link href="/dashboard" className="text-texte-principal hover:underline dark:text-texte-inverse">
              Tableau de bord
            </Link>
            <Link href="/transactions" className="text-texte-principal hover:underline dark:text-texte-inverse">
              Transactions
            </Link>
            <Link href="/objectifs" className="text-texte-principal hover:underline dark:text-texte-inverse">
              Objectifs
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button type="submit" className="text-encre-debit hover:underline">
                Déconnexion
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
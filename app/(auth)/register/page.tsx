'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { inscrire } from '@/lib/actions/auth.actions';

export default function PageInscription() {
  const [etat, action, enCours] = useActionState(inscrire, null);
  const router = useRouter();

  useEffect(() => {
    if (etat?.success) {
      router.push('/login?inscription=reussie');
    }
  }, [etat, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-papier-registre px-4 dark:bg-encre-nuit">
      <div className="w-full max-w-sm border-l-4 border-marge-registre p-8">
        <h1 className="font-display text-3xl font-bold text-texte-principal dark:text-texte-inverse">
          Créer un compte
        </h1>
        <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Commence à tenir ton registre.
        </p>

        <form action={action} className="mt-8 space-y-5">
          <div>
            <label htmlFor="nom" className="block font-sans text-sm font-medium text-texte-principal dark:text-texte-inverse">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full border border-texte-principal/30 bg-transparent px-3 py-2 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm font-medium text-texte-principal dark:text-texte-inverse">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full border border-texte-principal/30 bg-transparent px-3 py-2 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-sans text-sm font-medium text-texte-principal dark:text-texte-inverse">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full border border-texte-principal/30 bg-transparent px-3 py-2 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
            />
          </div>

          <div>
            <label htmlFor="confirmationMotDePasse" className="block font-sans text-sm font-medium text-texte-principal dark:text-texte-inverse">
              Confirmation du mot de passe
            </label>
            <input
              id="confirmationMotDePasse"
              name="confirmationMotDePasse"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1 w-full border border-texte-principal/30 bg-transparent px-3 py-2 font-mono text-sm text-texte-principal focus:border-encre-objectif focus:outline-none dark:border-texte-inverse/30 dark:text-texte-inverse"
            />
          </div>

          {etat && !etat.success && (
            <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
              {etat.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={enCours}
            className="w-full bg-encre-objectif px-4 py-2 font-sans text-sm font-semibold text-texte-inverse transition-opacity disabled:opacity-60"
          >
            {enCours ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-encre-objectif underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { connecter } from '@/lib/actions/auth.actions';
import { Champ } from '@/components/ui/Champ';
import { Bouton } from '@/components/ui/Bouton';

export default function PageConnexion() {
  const [etat, action, enCours] = useActionState(connecter, null);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-encre-nuit p-12 text-texte-inverse lg:flex">
        <span className="font-display text-2xl font-bold">Le Grand Livre</span>
        <div>
          <p className="font-mono text-sm tabular-nums text-texte-inverse/60">Solde du mois</p>
          <p className="font-mono text-5xl font-bold tabular-nums text-encre-credit">+1 245,30 €</p>
          <p className="mt-4 max-w-xs font-sans text-sm text-texte-inverse/70">
            Un registre clair pour tes dépenses, tes revenus et tes objectifs d’épargne.
          </p>
        </div>
        <p className="font-sans text-xs text-texte-inverse/40">© {new Date().getFullYear()}</p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-texte-principal dark:text-texte-inverse">Se connecter</h1>
          <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
            Accède à ton registre.
          </p>

          <form action={action} className="mt-8 space-y-5">
            <Champ label="Email" name="email" type="email" required autoComplete="email" />
            <Champ label="Mot de passe" name="password" type="password" required autoComplete="current-password" />

            {etat && !etat.success && (
              <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
                {etat.error.message}
              </p>
            )}

            <Bouton type="submit" disabled={enCours} className="w-full">
              {enCours ? 'Connexion...' : 'Se connecter'}
            </Bouton>
          </form>

          <p className="mt-6 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-semibold text-encre-objectif underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
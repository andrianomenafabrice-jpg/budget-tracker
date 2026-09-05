'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { inscrire } from '@/lib/actions/auth.actions';
import { Champ } from '@/components/ui/Champ';
import { Bouton } from '@/components/ui/Bouton';

export default function PageInscription() {
  const [etat, action, enCours] = useActionState(inscrire, null);
  const router = useRouter();

  useEffect(() => {
    if (etat?.success) {
      router.push('/login?inscription=reussie');
    }
  }, [etat, router]);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-encre-nuit p-12 text-texte-inverse lg:flex">
        <span className="font-display text-2xl font-bold">Le Grand Livre</span>
        <div>
          <p className="font-mono text-sm tabular-nums text-texte-inverse/60">Objectif Vacances</p>
          <p className="font-mono text-5xl font-bold tabular-nums text-encre-objectif">62 %</p>
          <p className="mt-4 max-w-xs font-sans text-sm text-texte-inverse/70">
            Fixe des objectifs d’épargne et suis leur progression, mois après mois.
          </p>
        </div>
        <p className="font-sans text-xs text-texte-inverse/40">© {new Date().getFullYear()}</p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-texte-principal dark:text-texte-inverse">Créer un compte</h1>
          <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
            Commence à tenir ton registre.
          </p>

          <form action={action} className="mt-8 space-y-5">
            <Champ label="Nom" name="nom" type="text" required autoComplete="name" />
            <Champ label="Email" name="email" type="email" required autoComplete="email" />
            <Champ label="Mot de passe" name="password" type="password" required minLength={8} autoComplete="new-password" />
            <Champ
              label="Confirmation du mot de passe"
              name="confirmationMotDePasse"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />

            {etat && !etat.success && (
              <p role="alert" className="font-sans text-sm font-medium text-encre-debit">
                {etat.error.message}
              </p>
            )}

            <Bouton type="submit" disabled={enCours} className="w-full">
              {enCours ? 'Création...' : 'Créer mon compte'}
            </Bouton>
          </form>

          <p className="mt-6 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-encre-objectif underline">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
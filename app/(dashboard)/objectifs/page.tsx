import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { savingsGoals } from '@/lib/db/schema';
import { FormulaireObjectif } from '@/components/objectifs/FormulaireObjectif';
import { FormulaireContribution } from '@/components/objectifs/FormulaireContribution';
import { JaugeObjectif } from '@/components/objectifs/JaugeObjectif';
import { BoutonSupprimerObjectif } from '@/components/objectifs/BoutonSupprimerObjectif';

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PageObjectifs() {
  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const mesObjectifs = await db
    .select()
    .from(savingsGoals)
    .where(eq(savingsGoals.userId, userId))
    .orderBy(savingsGoals.createdAt);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-2xl font-bold text-texte-principal dark:text-texte-inverse">
          Objectifs d’épargne
        </h1>
        <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Fixe-toi un cap et suis ta progression.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-texte-principal/60 dark:text-texte-inverse/60">
          Nouvel objectif
        </h2>
        <FormulaireObjectif />
      </section>

      <section className="space-y-6">
        {mesObjectifs.length === 0 ? (
          <p className="border-l-4 border-marge-registre p-4 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
            Aucun objectif pour l’instant. Crée le premier ci-dessus.
          </p>
        ) : (
          mesObjectifs.map((objectif) => (
            <div key={objectif.id} className="border-l-4 border-marge-registre p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-texte-principal dark:text-texte-inverse">
                    {objectif.nom}
                  </h3>
                  <p className="font-mono text-sm tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
                    {objectif.montantActuel} € / {objectif.montantCible} €
                    {objectif.dateLimite && (
                      <span className="ml-2 text-texte-principal/50 dark:text-texte-inverse/50">
                        · avant le {new Date(objectif.dateLimite).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </p>
                </div>
                <BoutonSupprimerObjectif objectifId={objectif.id} />
              </div>

              <div className="mt-4">
                <JaugeObjectif montantActuel={objectif.montantActuel} montantCible={objectif.montantCible} />
              </div>

              <FormulaireContribution objectifId={objectif.id} />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
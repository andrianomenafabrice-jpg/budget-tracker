import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { savingsGoals } from '@/lib/db/schema';
import { FormulaireObjectif } from '@/components/objectifs/FormulaireObjectif';
import { FormulaireContribution } from '@/components/objectifs/FormulaireContribution';
import { JaugeObjectif } from '@/components/objectifs/JaugeObjectif';
import { BoutonSupprimerObjectif } from '@/components/objectifs/BoutonSupprimerObjectif';

export const metadata = {
  title: 'Objectifs d’épargne',
  robots: { index: false, follow: false },
};

export default async function PageObjectifs() {
  const session = await auth();
  const userId = session!.user.id;
  const db = getDb();

  const mesObjectifs = await db.select().from(savingsGoals).where(eq(savingsGoals.userId, userId)).orderBy(savingsGoals.createdAt);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-texte-principal dark:text-texte-inverse">Objectifs d’épargne</h1>
        <p className="mt-1 font-sans text-sm text-texte-principal/70 dark:text-texte-inverse/70">
          Fixe-toi un cap et suis ta progression.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-texte-principal dark:text-texte-inverse">Nouvel objectif</h2>
        <FormulaireObjectif />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {mesObjectifs.length === 0 ? (
          <p className="surface-carte p-4 font-sans text-sm text-texte-principal/70 lg:col-span-2 dark:text-texte-inverse/70">
            Aucun objectif pour l’instant. Crée le premier ci-dessus.
          </p>
        ) : (
          mesObjectifs.map((objectif) => (
            <div key={objectif.id} className="surface-carte p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-texte-principal dark:text-texte-inverse">{objectif.nom}</h3>
                  <p className="font-mono text-sm tabular-nums text-texte-principal/70 dark:text-texte-inverse/70">
                    {objectif.montantActuel} € sur {objectif.montantCible} €
                  </p>
                  {objectif.dateLimite && (
                    <p className="font-sans text-xs text-texte-principal/50 dark:text-texte-inverse/50">
                      avant le {new Date(objectif.dateLimite).toLocaleDateString('fr-FR')}
                    </p>
                  )}
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
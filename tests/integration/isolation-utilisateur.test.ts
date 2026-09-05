/**
 * @jest-environment node
 */
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { users, categories, transactions, savingsGoals } from '@/lib/db/schema';
import {
  modifierTransactionPourUtilisateur,
  supprimerTransactionPourUtilisateur,
  recupererTransactionParId,
} from '@/lib/repositories/transaction.repository';
import {
  ajouterContributionPourUtilisateur,
  supprimerObjectifPourUtilisateur,
  recupererObjectifParId,
} from '@/lib/repositories/objectif.repository';

/**
 * Test d'intégration réel contre la base Neon de développement (pas de mock).
 * Crée deux utilisateurs de test, une transaction et un objectif chacun,
 * vérifie qu'aucune opération croisée n'est possible, puis nettoie tout
 * (la suppression des users entraîne la suppression en cascade du reste).
 */

let utilisateurAId: string;
let utilisateurBId: string;
let categorieAId: string;
let categorieBId: string;
let transactionAId: string;
let objectifAId: string;

beforeAll(async () => {
  const db = getDb();

  const [utilisateurA] = await db
    .insert(users)
    .values({ nom: 'Test Isolation A', email: `test-isolation-a-${Date.now()}@exemple.test`, motDePasseHash: 'x' })
    .returning({ id: users.id });
  const [utilisateurB] = await db
    .insert(users)
    .values({ nom: 'Test Isolation B', email: `test-isolation-b-${Date.now()}@exemple.test`, motDePasseHash: 'x' })
    .returning({ id: users.id });

  utilisateurAId = utilisateurA.id;
  utilisateurBId = utilisateurB.id;

  const [categorieA] = await db
    .insert(categories)
    .values({ userId: utilisateurAId, nom: 'Cat A', type: 'depense', couleur: '#4F6B4A' })
    .returning({ id: categories.id });
  const [categorieB] = await db
    .insert(categories)
    .values({ userId: utilisateurBId, nom: 'Cat B', type: 'depense', couleur: '#5B4566' })
    .returning({ id: categories.id });

  categorieAId = categorieA.id;
  categorieBId = categorieB.id;

  const [transactionA] = await db
    .insert(transactions)
    .values({
      userId: utilisateurAId,
      categoryId: categorieAId,
      type: 'depense',
      montant: '100.00',
      date: new Date(),
    })
    .returning({ id: transactions.id });
  transactionAId = transactionA.id;

  const [objectifA] = await db
    .insert(savingsGoals)
    .values({ userId: utilisateurAId, nom: 'Objectif A', montantCible: '1000.00', montantActuel: '0' })
    .returning({ id: savingsGoals.id });
  objectifAId = objectifA.id;
});

afterAll(async () => {
  const db = getDb();
  // La suppression des utilisateurs entraîne la suppression en cascade
  // de leurs catégories, transactions et objectifs (contraintes onDelete: 'cascade').
  await db.delete(users).where(eq(users.id, utilisateurAId));
  await db.delete(users).where(eq(users.id, utilisateurBId));
});

describe('Isolation par utilisateur — transactions', () => {
  it("refuse la suppression d'une transaction appartenant à un autre utilisateur", async () => {
    const reponse = await supprimerTransactionPourUtilisateur(utilisateurBId, transactionAId);
    expect(reponse.trouve).toBe(false);

    const transactionEncorePresente = await recupererTransactionParId(transactionAId);
    expect(transactionEncorePresente).not.toBeNull();
  });

  it("refuse la modification d'une transaction appartenant à un autre utilisateur", async () => {
    const reponse = await modifierTransactionPourUtilisateur(utilisateurBId, transactionAId, {
      categoryId: categorieBId,
      montant: '999.99',
      description: 'tentative frauduleuse',
      date: new Date(),
    });
    expect(reponse.trouve).toBe(false);

    const transactionInchangee = await recupererTransactionParId(transactionAId);
    expect(transactionInchangee?.montant).toBe('100.00');
  });

  it('autorise le propriétaire réel à supprimer sa propre transaction', async () => {
    const reponse = await supprimerTransactionPourUtilisateur(utilisateurAId, transactionAId);
    expect(reponse.trouve).toBe(true);

    const transactionSupprimee = await recupererTransactionParId(transactionAId);
    expect(transactionSupprimee).toBeNull();
  });
});

describe('Isolation par utilisateur — objectifs d’épargne', () => {
  it("refuse d'ajouter une contribution à un objectif appartenant à un autre utilisateur", async () => {
    const reponse = await ajouterContributionPourUtilisateur(utilisateurBId, objectifAId, '500.00');
    expect(reponse.trouve).toBe(false);

    const objectifInchange = await recupererObjectifParId(objectifAId);
    expect(objectifInchange?.montantActuel).toBe('0.00');
  });

  it("refuse la suppression d'un objectif appartenant à un autre utilisateur", async () => {
    const reponse = await supprimerObjectifPourUtilisateur(utilisateurBId, objectifAId);
    expect(reponse.trouve).toBe(false);

    const objectifEncorePresent = await recupererObjectifParId(objectifAId);
    expect(objectifEncorePresent).not.toBeNull();
  });
});
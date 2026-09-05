import { pgTable, pgEnum, uuid, varchar, text, numeric, timestamp, uniqueIndex, index, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const typeTransactionEnum = pgEnum('type_transaction', ['depense', 'revenu']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  nom: varchar('nom', { length: 120 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  motDePasseHash: varchar('mot_de_passe_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  nom: varchar('nom', { length: 80 }).notNull(),
  type: typeTransactionEnum('type').notNull(),
  couleur: varchar('couleur', { length: 7 }).notNull(), // hex, ex. #4F6B4A
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  uniqueUserNom: uniqueIndex('categories_user_id_nom_unique').on(table.userId, table.nom),
}));

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
  type: typeTransactionEnum('type').notNull(),
  montant: numeric('montant', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userDateIdx: index('transactions_user_id_date_idx').on(table.userId, table.date),
  montantPositif: check('transactions_montant_positif', sql`${table.montant} > 0`),
}));

export const savingsGoals = pgTable('savings_goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  nom: varchar('nom', { length: 120 }).notNull(),
  montantCible: numeric('montant_cible', { precision: 12, scale: 2 }).notNull(),
  montantActuel: numeric('montant_actuel', { precision: 12, scale: 2 }).notNull().default('0'),
  dateLimite: timestamp('date_limite'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations — permettent des requêtes typées avec jointure :
// db.query.transactions.findMany({ with: { categorie: true } })
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  categorie: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
  savingsGoals: many(savingsGoals),
}));

// Types inférés automatiquement — jamais de `any` côté frontend
export type Transaction = typeof transactions.$inferSelect;
export type NouvelleTransaction = typeof transactions.$inferInsert;
export type Categorie = typeof categories.$inferSelect;
export type NouvelleCategorie = typeof categories.$inferInsert;
export type ObjectifEpargne = typeof savingsGoals.$inferSelect;
export type NouvelObjectifEpargne = typeof savingsGoals.$inferInsert;
export type User = typeof users.$inferSelect;
export type NouvelUser = typeof users.$inferInsert;
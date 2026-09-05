# Le Grand Livre — Suivi de budget

Application full-stack de gestion de budget personnel : suivi des dépenses et revenus, tableau de bord avec graphiques, objectifs d'épargne avec suivi de progression.

**[Démo en ligne](https://ton-url-vercel.vercel.app)**

## Aperçu

- Authentification (NextAuth v5, mots de passe hachés avec bcrypt)
- CRUD complet des transactions et catégories, avec filtres et export CSV
- Tableau de bord avec graphiques (évolution mensuelle, répartition par catégorie) via Recharts
- Objectifs d'épargne avec contributions incrémentales et jauge de progression
- Thème clair/sombre avec bascule manuelle persistante
- Interface entièrement responsive, testée mobile/tablette/desktop

## Stack technique

**Frontend** — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React Hook Form, Recharts

**Backend** — Server Actions Next.js, Drizzle ORM, PostgreSQL (Neon serverless), NextAuth.js v5, Zod / drizzle-zod

**Tests** — Jest, React Testing Library, tests d'intégration contre la base réelle (isolation des données par utilisateur)

## Choix d'architecture

- **Montants stockés en `numeric` Postgres**, convertis en centimes entiers pour tout calcul métier (`lib/utils/money.ts`) — élimine les erreurs d'arithmétique flottante sur des sommes d'argent.
- **Logique métier isolée en fonctions pures** (`lib/services/`), testées indépendamment de la base de données — couverture à 100 % sur les calculs d'agrégation et de progression.
- **Isolation stricte par utilisateur** vérifiée par un test d'intégration réel (pas de mock) : chaque requête de lecture/écriture filtre systématiquement par `userId` extrait de la session serveur, jamais transmis par le client.
- **Validation en double** : côté client (React Hook Form + Zod, retour instantané) et côté serveur (Server Actions, jamais de confiance dans l'input client).

## Lancer le projet en local

\`\`\`bash
git clone https://github.com/andrianomenafabrice-jpg/budget-tracker.git
cd budget-tracker
npm install
\`\`\`

Crée un fichier `.env.local` à la racine :

\`\`\`
DATABASE_URL=
DATABASE_URL_UNPOOLED=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
\`\`\`

(nécessite un projet [Neon](https://neon.tech) gratuit pour la base PostgreSQL)

\`\`\`bash
npx drizzle-kit generate
npx drizzle-kit migrate
npm run dev
\`\`\`

## Tests

\`\`\`bash
npm test                    # tests unitaires et composants
npm run test:coverage       # avec rapport de couverture
npm run test:integration    # tests d'intégration (nécessite une base réelle)
\`\`\`

## Auteur

Andrianomena Fabrice (Nomena)
[LinkedIn](https://linkedin.com/in/ralaiarisoa-andrianomena-fabrice-a3a964431) · [GitHub](https://github.com/andrianomenafabrice-jpg)

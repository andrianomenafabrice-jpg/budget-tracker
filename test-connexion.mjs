import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);
try {
  const resultat = await sql`SELECT 1 as test`;
  console.log('Connexion OK :', resultat);
} catch (erreur) {
  console.error('Connexion ECHOUEE, détail complet :');
  console.error(erreur);
}

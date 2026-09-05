import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!dbInstance) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquant');
    dbInstance = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return dbInstance;
}
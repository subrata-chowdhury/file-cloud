import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

declare global {
  var pgPool: Pool | undefined;
}

export const db = global.pgPool || new Pool({ connectionString });

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = db;
}

export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  const res = await db.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

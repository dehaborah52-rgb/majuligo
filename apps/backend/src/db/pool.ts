import { Pool, PoolConfig } from 'pg';

const connectionString = process.env.DATABASE_URL;

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (!connectionString) {
    return null;
  }

  if (!pool) {
    const config: PoolConfig = {
      connectionString,
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
      max: 10,
      idleTimeoutMillis: 30000,
    };
    pool = new Pool(config);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }

  return pool;
}

export async function queryDb<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool();
  if (!p) {
    // If no real database URL is configured, return empty array (in-memory mode for development)
    return [];
  }
  const result = await p.query(text, params);
  return result.rows;
}

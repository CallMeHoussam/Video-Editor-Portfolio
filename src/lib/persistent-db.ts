import { neon, neonConfig } from '@neondatabase/serverless';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PortfolioData } from '@/types/portfolio';

// Disable WebSocket requirement for simple pooled HTTP queries
neonConfig.fetchConnectionCache = true;

export type PersistentDbProvider = 'neon' | 'supabase' | 'postgres' | 'local-json';

export interface DbConfigStatus {
  provider: PersistentDbProvider;
  isConfigured: boolean;
  connectionStringMasked?: string;
  tableName: string;
}

const TABLE_NAME = 'evoless_portfolio_store';

/**
 * Returns configuration status of external persistent database.
 */
export function getDbConfigStatus(): DbConfigStatus {
  const postgresUrl =
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim();

  if (postgresUrl) {
    let masked = 'configured';
    try {
      const u = new URL(postgresUrl);
      masked = `${u.protocol}//${u.username ? '***@' : ''}${u.host}${u.pathname}`;
    } catch {
      // ignore parse error
    }
    return {
      provider: postgresUrl.includes('neon.tech') ? 'neon' : 'postgres',
      isConfigured: true,
      connectionStringMasked: masked,
      tableName: TABLE_NAME,
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl && supabaseKey) {
    return {
      provider: 'supabase',
      isConfigured: true,
      connectionStringMasked: supabaseUrl,
      tableName: TABLE_NAME,
    };
  }

  return {
    provider: 'local-json',
    isConfigured: false,
    tableName: TABLE_NAME,
  };
}

let neonQueryFn: ReturnType<typeof neon> | null = null;
let supabaseClient: SupabaseClient | null = null;
let tableInitialized = false;

function getPostgresUrl(): string | null {
  return (
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_PRISMA_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    null
  );
}

function getNeonQuery() {
  const url = getPostgresUrl();
  if (!url) return null;
  if (!neonQueryFn) {
    neonQueryFn = neon(url);
  }
  return neonQueryFn;
}

function getSupabase() {
  const url = process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return supabaseClient;
}

/**
 * Ensures the key-value/document store table exists on Neon / Postgres.
 */
async function ensurePostgresTable() {
  if (tableInitialized) return;
  const sql = getNeonQuery();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS evoless_portfolio_store (
        id VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    tableInitialized = true;
  } catch (err) {
    console.warn('[Persistent DB] Could not run CREATE TABLE:', err);
  }
}

/**
 * Reads portfolio data from the persistent database.
 * Returns null if no external database is configured, or if data row is not yet stored.
 */
export async function loadPortfolioDataFromDb(): Promise<PortfolioData | null> {
  // 1. Neon / Standard Postgres (recommended on Vercel)
  const sql = getNeonQuery();
  if (sql) {
    try {
      await ensurePostgresTable();
      const rows = (await sql`
        SELECT data FROM evoless_portfolio_store WHERE id = 'main' LIMIT 1;
      `) as unknown as Array<{ data: PortfolioData }>;
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
        return rows[0].data as PortfolioData;
      }
      return null;
    } catch (err) {
      console.warn('[Persistent DB - Postgres Error]:', err);
      return null;
    }
  }

  // 2. Supabase alternative
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('data')
        .eq('id', 'main')
        .maybeSingle();

      if (!error && data && data.data) {
        return data.data as PortfolioData;
      }
      return null;
    } catch (err) {
      console.warn('[Persistent DB - Supabase Error]:', err);
      return null;
    }
  }

  return null;
}

/**
 * Persists portfolio data into the persistent database.
 * Survives Vercel redeployments, branch deploys, and serverless cold starts.
 */
export async function savePortfolioDataToDb(data: PortfolioData): Promise<boolean> {
  // 1. Neon / Standard Postgres
  const sql = getNeonQuery();
  if (sql) {
    try {
      await ensurePostgresTable();
      await sql`
        INSERT INTO evoless_portfolio_store (id, data, updated_at)
        VALUES ('main', ${JSON.stringify(data)}::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET
          data = EXCLUDED.data,
          updated_at = NOW();
      `;
      return true;
    } catch (err) {
      console.error('[Persistent DB - Postgres Save Error]:', err);
      return false;
    }
  }

  // 2. Supabase alternative
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from(TABLE_NAME).upsert({
        id: 'main',
        data,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (err) {
      console.error('[Persistent DB - Supabase Save Error]:', err);
      return false;
    }
  }

  return false;
}

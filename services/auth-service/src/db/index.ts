import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Nonces table operations
export const nonces = {
  async upsert(data: { wallet_address: string; nonce: string; expires_at: Date }) {
    const query = `
      INSERT INTO nonces (wallet_address, nonce, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (wallet_address)
      DO UPDATE SET nonce = $2, expires_at = $3
    `;
    await pool.query(query, [data.wallet_address, data.nonce, data.expires_at]);
  },

  async find(walletAddress: string) {
    const query = 'SELECT * FROM nonces WHERE wallet_address = $1';
    const result = await pool.query(query, [walletAddress]);
    return result.rows[0] || null;
  },
};

// Audit logs table operations
export const audit_logs = {
  async insert(data: {
    event: string;
    wallet_address?: string;
    ip?: string;
    metadata?: any;
  }) {
    const query = `
      INSERT INTO audit_logs (id, event, wallet_address, ip, metadata)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [
      uuidv4(),
      data.event,
      data.wallet_address || null,
      data.ip || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]);
  },
};

// Refresh tokens table operations
export const refresh_tokens = {
  async findByHash(tokenHash: string) {
    const query = 'SELECT * FROM refresh_tokens WHERE token_hash = $1';
    const result = await pool.query(query, [tokenHash]);
    return result.rows[0] || null;
  },

  async update(id: string, data: { revoked?: boolean }) {
    const query = 'UPDATE refresh_tokens SET revoked = $1 WHERE id = $2';
    await pool.query(query, [data.revoked || false, id]);
  },

  async insert(data: {
    wallet_address: string;
    token_hash: string;
    expires_at: Date;
    replaced_by?: string;
  }) {
    const query = `
      INSERT INTO refresh_tokens (id, wallet_address, token_hash, expires_at, replaced_by)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [
      uuidv4(),
      data.wallet_address,
      data.token_hash,
      data.expires_at,
      data.replaced_by || null,
    ]);
  },
};

// Sessions table operations
export const sessions = {
  async find(id: string) {
    const query = 'SELECT * FROM sessions WHERE id = $1';
    const result = await pool.query(query, [id]);
    const session = result.rows[0];
    if (session) {
      // Check if session is expired
      session.revoked = session.expires_at < new Date();
    }
    return session || null;
  },

  async update(id: string, data: { revoked?: boolean }) {
    // Update expires_at to mark as revoked (set to past)
    if (data.revoked) {
      const query = 'UPDATE sessions SET expires_at = CURRENT_TIMESTAMP - INTERVAL \'1 day\' WHERE id = $1';
      await pool.query(query, [id]);
    }
  },
};

// Role cache table operations
// Note: This table may need to be created in the database
// CREATE TABLE IF NOT EXISTS role_cache (
//   wallet_address TEXT PRIMARY KEY,
//   roles JSONB NOT NULL,
//   updated_at BIGINT NOT NULL
// );
export const role_cache = {
  async find(walletAddress: string) {
    try {
      const query = 'SELECT * FROM role_cache WHERE wallet_address = $1';
      const result = await pool.query(query, [walletAddress]);
      if (result.rows[0]) {
        const row = result.rows[0];
        // Convert roles from JSONB to object, and ensure updated_at is a number
        return {
          wallet_address: row.wallet_address,
          roles: typeof row.roles === 'string' 
            ? JSON.parse(row.roles) 
            : row.roles,
          updated_at: typeof row.updated_at === 'number' 
            ? row.updated_at 
            : parseInt(row.updated_at, 10),
        };
      }
      return null;
    } catch (error: any) {
      // If table doesn't exist, return null
      if (error.code === '42P01') {
        return null;
      }
      throw error;
    }
  },

  async upsert(data: { wallet_address: string; roles: any; updated_at: number }) {
    try {
      const query = `
        INSERT INTO role_cache (wallet_address, roles, updated_at)
        VALUES ($1, $2::jsonb, $3)
        ON CONFLICT (wallet_address)
        DO UPDATE SET roles = $2::jsonb, updated_at = $3
      `;
      await pool.query(query, [
        data.wallet_address,
        JSON.stringify(data.roles),
        data.updated_at,
      ]);
    } catch (error: any) {
      // If table doesn't exist, create it and retry
      if (error.code === '42P01') {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS role_cache (
            wallet_address TEXT PRIMARY KEY,
            roles JSONB NOT NULL,
            updated_at BIGINT NOT NULL
          )
        `);
        // Retry the upsert
        const query = `
          INSERT INTO role_cache (wallet_address, roles, updated_at)
          VALUES ($1, $2::jsonb, $3)
          ON CONFLICT (wallet_address)
          DO UPDATE SET roles = $2::jsonb, updated_at = $3
        `;
        await pool.query(query, [
          data.wallet_address,
          JSON.stringify(data.roles),
          data.updated_at,
        ]);
      } else {
        throw error;
      }
    }
  },
};

export const db = {
  nonces,
  audit_logs,
  refresh_tokens,
  sessions,
  role_cache,
};


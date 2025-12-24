import { db } from '../db/index.js';
import { RoleCache } from '../cache/roleCache.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    roleCache: RoleCache;
  }
}


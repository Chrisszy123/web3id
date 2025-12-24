import { resolveRoles } from "../lib/roleResolver";

export class RoleCache {
    constructor(private db: any) {}
  
    async get(wallet: string) {
      const cached = await this.db.role_cache.find(wallet);
  
      if (cached && Date.now() - cached.updated_at < 10 * 60 * 1000) {
        return cached.roles;
      }
  
      const roles = await resolveRoles(wallet);
  
      await this.db.role_cache.upsert({
        wallet_address: wallet,
        roles,
        updated_at: Date.now()
      });
  
      return roles;
    }
  }
  
import { Context, Elysia } from 'elysia';
import { authPlugin } from './auth.plugin';
import { redis } from './redis.plugin';
import { AuthRepository } from '@/modules/auth/auth.repository';
import { RoleData } from '@/modules/auth/auth.type';

const repository = new AuthRepository();
interface AuthContext extends Context {
  user: {
    id: number;
    roleId: number;
  };
}

async function checkPermission(
  roleId: number,
  permission: string,
): Promise<boolean> {
  const cacheKey = `role:${roleId}`;
  let role: RoleData | null = null;
  let rawRoleData = await redis.get(cacheKey);

  if (rawRoleData) {
    role = JSON.parse(rawRoleData);
  } else {
    role = await repository.findRoleById(roleId);

    if (!role) {
      return false;
    }

    await redis.set(cacheKey, JSON.stringify(role), 'EX', 3600); // Cache for 1 hour
  }

  return role?.access.includes(permission) as boolean;
}

export const permission =
  (permissionName: string) =>
  async ({ user, status }: AuthContext) => {
    const allowed = await checkPermission(user.roleId, permissionName);

    if (!allowed) {
      throw status(403, 'Forbidden');
    }
  };

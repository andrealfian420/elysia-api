import { Elysia } from 'elysia';
import { jwtPlugin } from '@/app/plugins/jwt.plugin';
import { AuthRepository } from '@/modules/auth/auth.repository';

const repository = new AuthRepository();

export const authPlugin = new Elysia()
  .use(jwtPlugin)
  .derive(async ({ accessJwt, headers, error }) => {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(401, 'Unauthorized');
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await accessJwt.verify(token);

    if (!payload) {
      return error(401, 'Invalid token');
    }

    const user = await repository.findAuthUserById(Number(payload.sub));

    if (!user) {
      return error(401, 'User not found');
    }

    return {
      user: { id: user.id },
    };
  });

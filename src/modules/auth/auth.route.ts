import { Elysia } from 'elysia';

import { jwtPlugin } from '@/app/plugins/jwt.plugin';
import { AuthController } from './auth.controller';
import { loginDto } from './dto';

const authController = new AuthController();

export const authRoute = new Elysia({
  prefix: '/auth',
})
  .use(jwtPlugin)
  .post('/login', authController.login, {
    body: loginDto,
  });

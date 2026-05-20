import { Elysia } from 'elysia';

import { jwtPlugin } from '@/app/plugins/jwt.plugin';
import { AuthController } from './auth.controller';
import { loginDto, registerDto } from './dto';

const authController = new AuthController();

export const authRoute = new Elysia({
  prefix: '/auth',
})
  .use(jwtPlugin)
  .post('/login', authController.login, {
    body: loginDto,
  })
  .post('/register', authController.register, {
    body: registerDto,
  })
  .post('/refresh', authController.refresh)
  .post('/logout', authController.logout)
  .post('/logout-all', authController.logoutAll);

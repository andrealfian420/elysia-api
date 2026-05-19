import { Elysia } from 'elysia';

import { loginDto } from './dto';
import { AuthService } from './auth.service';
import { jwtPlugin } from '@/app/plugins/jwt.plugin';

const authService = new AuthService();

export const authRoute = new Elysia().use(jwtPlugin).post(
  '/login',
  async ({ body, accessJwt, cookie, headers, request }) => {
    const result = await authService.login(body, accessJwt, {
      userAgent: headers['user-agent'],

      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    const refreshTokenExpiryDay = Number(
      process.env.REFRESH_TOKEN_EXPIRY_DAY ?? 7,
    );

    cookie.refreshToken.set({
      value: result.refreshToken,

      httpOnly: true,

      secure: process.env.NODE_ENV === 'production',

      sameSite: 'lax',

      maxAge: 60 * 60 * 24 * refreshTokenExpiryDay,

      path: '/',
    });

    return result;
  },

  {
    body: loginDto,
  },
);

import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';

export const jwtPlugin = new Elysia().use(
  jwt({
    name: 'accessJwt',
    secret: process.env.JWT_ACCESS_SECRET as string,
    exp: process.env.ACCESS_TOKEN_EXPIRES || '10m',
  }),
);

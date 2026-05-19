import { t } from 'elysia';

export const registerDto = t.Object({
  name: t.String({
    minLength: 2,
    maxLength: 100,
  }),
  email: t.String({
    format: 'email',
  }),
  password: t.String({
    minLength: 8,
    maxLength: 100,
  }),
});

export type RegisterDto = typeof registerDto.static;

import { t } from 'elysia';

export const loginDto = t.Object({
  email: t.String({
    format: 'email',
  }),
  password: t.String({
    minLength: 8,
  }),
});

export type LoginDto = typeof loginDto.static;

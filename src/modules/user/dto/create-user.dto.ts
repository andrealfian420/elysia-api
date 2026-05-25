import { t } from 'elysia';

export const createUserDto = t.Object({
  name: t.String({
    minLength: 2,
    maxLength: 100,
  }),
  email: t.String({
    format: 'email',
  }),
  password: t.String({
    minLength: 8,
  }),
  roleId: t.Number(),
});

export type CreateUserDto = typeof createUserDto.static;

import { Elysia } from 'elysia';

export const indexRoute = new Elysia().get('/', () => {
  return {
    success: true,
    message: 'API is running',
  };
});

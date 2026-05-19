import { Elysia } from 'elysia';
import { routes } from './routes';

export const app = new Elysia({
  prefix: '/api/v1',
}).use(routes);

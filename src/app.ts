import { Elysia } from 'elysia';
import { indexRoute } from './routes';

export const app = new Elysia({
  prefix: '/api/v1',
}).use(indexRoute);

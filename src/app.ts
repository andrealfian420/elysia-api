import { Elysia } from 'elysia';
import { indexRoute } from './routes';
import { jwtPlugin } from './app/plugins/jwt.plugin';

export const app = new Elysia({
  prefix: '/api/v1',
})
  .use(indexRoute)
  .use(jwtPlugin);

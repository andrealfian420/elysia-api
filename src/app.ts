import { Elysia } from 'elysia';
import { routes } from './routes';
import { errorPlugin } from './app/plugins/error.plugin';

export const app = new Elysia({
  prefix: '/api/v1',
})
  .use(errorPlugin)
  .use(routes);

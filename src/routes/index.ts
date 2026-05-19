import { authRoute } from '@/modules/auth/auth.route';
import { Elysia } from 'elysia';

export const routes = new Elysia().use(authRoute);

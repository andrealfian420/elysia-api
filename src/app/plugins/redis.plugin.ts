import { Elysia } from 'elysia';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl);

export const redisPlugin = new Elysia().decorate('redis', redis);

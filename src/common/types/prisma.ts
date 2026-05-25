import { Prisma, PrismaClient } from '@/generated/prisma/client';

export type PrismaTx = Prisma.TransactionClient | PrismaClient;

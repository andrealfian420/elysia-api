import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { createSoftDeleteExtension } from 'prisma-extension-soft-delete';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({
  connectionString,
});

const extendedPrisma = new PrismaClient({
  adapter,
  log: ['error'],
}).$extends(
  createSoftDeleteExtension({
    models: {
      // Add the models you want to use soft delete on here
      User: true,
      Role: true,
    },

    defaultConfig: {
      field: 'deletedAt',

      createValue: (deleted) => {
        if (deleted) {
          return new Date();
        }

        return null;
      },
    },
  }),
);

const globalForPrisma = globalThis as unknown as {
  prisma: typeof extendedPrisma;
};

export const prisma = globalForPrisma.prisma || extendedPrisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

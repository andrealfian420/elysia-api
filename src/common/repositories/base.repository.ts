import { prisma } from '@/database/prisma/prisma';
import { PrismaTx } from '../types/prisma';

// BaseRepository is an abstract class that provides common functionality for all repositories in the application.
export abstract class BaseRepository {
  protected db(tx?: PrismaTx) {
    return tx ?? prisma;
  }

  protected activeWhere<T extends object>(where?: T) {
    return {
      ...(where ?? {}),
      deletedAt: null,
    };
  }

  protected softDeleteData<T extends object>(data?: T) {
    return {
      ...(data ?? {}),
      deletedAt: new Date(),
    };
  }
}

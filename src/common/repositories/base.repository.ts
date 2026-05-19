import { prisma } from '@/database/prisma/prisma';

// BaseRepository is an abstract class that provides common functionality for all repositories in the application.
export abstract class BaseRepository {
  protected prisma = prisma;

  protected activeWhere<T>(where: T): T {
    return {
      ...where,
      deletedAt: null,
    };
  }

  protected softDeleteData<T>(data: T): T {
    return {
      ...data,
      deletedAt: new Date(),
    };
  }
}

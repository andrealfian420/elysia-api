import { BaseRepository } from '@/common/repositories/base.repository';
import { paginate, PaginationQuery } from '@/common/utils/paginator';
import type { PrismaTx } from '@/common/types/prisma';
import type { Prisma, User } from '@/generated/prisma/client';
import { UserListData, UserListResponse } from './user.type';

export class UserRepository extends BaseRepository {
  async getUsers(
    query: PaginationQuery,
    request: Request,
    currentUserId: number,
  ): Promise<UserListResponse> {
    return paginate<UserListData>(
      this.db().user,
      {
        where: this.activeWhere({}),

        whereNot: {
          id: currentUserId,
        },

        select: {
          id: true,
          name: true,
          email: true,

          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },

        searchFields: ['name', 'email'],

        allowedSorts: ['name', 'email', 'createdAt'],
      },
      query,
      request,
    );
  }

  async findById(id: number, tx?: PrismaTx): Promise<User | null> {
    return this.db(tx).user.findFirst({
      where: this.activeWhere({
        id,
      }),
    });
  }

  async create(data: Prisma.UserCreateInput, tx?: PrismaTx): Promise<User> {
    return this.db(tx).user.create({
      data,
    });
  }

  async update(
    id: number,
    data: Prisma.UserUpdateInput,
    tx?: PrismaTx,
  ): Promise<User> {
    return this.db(tx).user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number, tx?: PrismaTx): Promise<User> {
    return this.db(tx).user.update({
      where: {
        id,
      },
      data: this.softDeleteData({}),
    });
  }
}

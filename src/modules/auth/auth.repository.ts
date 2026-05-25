import { BaseRepository } from '@/common/repositories/base.repository';
import { Prisma, User, RefreshToken, Role } from '@/generated/prisma/client';
import { RoleData } from './auth.type';
import { PrismaTx } from '@/common/types/prisma';

export class AuthRepository extends BaseRepository {
  async findAuthUserById(
    id: number,
    tx?: PrismaTx,
  ): Promise<{ id: number; roleId: number } | null> {
    return this.db(tx).user.findFirst({
      where: this.activeWhere({
        id,
      }),
      select: {
        id: true,
        roleId: true,
      },
    });
  }

  async findUserByEmail(email: string, tx?: PrismaTx): Promise<User | null> {
    return this.db(tx).user.findFirst({
      where: this.activeWhere({
        email,
      }),
      include: { role: true },
    });
  }

  async createUser(
    data: Prisma.UserUncheckedCreateInput,
    tx?: PrismaTx,
  ): Promise<User> {
    return this.db(tx).user.create({
      data,
    });
  }

  async createRefreshToken(
    data: Prisma.RefreshTokenUncheckedCreateInput,
    tx?: PrismaTx,
  ): Promise<RefreshToken> {
    return this.db(tx).refreshToken.create({
      data,
    });
  }

  async findByRoleCode(code: string, tx?: PrismaTx): Promise<Role | null> {
    return this.db(tx).role.findFirst({
      where: this.activeWhere({
        code,
      }),
    });
  }

  async findRefreshToken(
    tokenHash: string,
    tx?: PrismaTx,
  ): Promise<RefreshToken | null> {
    return this.db(tx).refreshToken.findUnique({
      where: {
        tokenHash,
      },

      include: {
        user: true,
      },
    });
  }

  async deleteRefreshToken(tokenHash: string, tx?: PrismaTx): Promise<void> {
    await this.db(tx).refreshToken.deleteMany({
      where: {
        tokenHash,
      },
    });
  }

  async deleteUserRefreshTokens(userId: number, tx?: PrismaTx): Promise<void> {
    await this.db(tx).refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findRoleById(id: number, tx?: PrismaTx): Promise<RoleData | null> {
    return this.db(tx).role.findFirst({
      where: this.activeWhere({
        id,
      }),
      select: {
        id: true,
        name: true,
        access: true,
      },
    });
  }
}

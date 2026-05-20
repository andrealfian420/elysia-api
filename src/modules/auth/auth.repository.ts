import { BaseRepository } from '@/common/repositories/base.repository';
import { Prisma, User, RefreshToken, Role } from '@/generated/prisma/client';

export class AuthRepository extends BaseRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: this.activeWhere({
        email,
      }),
      include: { role: true },
    });
  }

  async createUser(data: Prisma.UserUncheckedCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createRefreshToken(
    data: Prisma.RefreshTokenUncheckedCreateInput,
  ): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({
      data,
    });
  }

  async findByRoleCode(code: string): Promise<Role | null> {
    return this.prisma.role.findFirst({
      where: this.activeWhere({
        code,
      }),
    });
  }

  async findRefreshToken(
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },

      include: {
        user: true,
      },
    });
  }

  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: {
        tokenHash,
      },
    });
  }
}

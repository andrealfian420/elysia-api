import { compare, hash } from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { ROLE_CODE } from '@/common/constants/role.constant';
import {
  AccessJwt,
  LoginContext,
  LoginResult,
  RegisterResponse,
} from './auth.type';
import { LoginDto, RegisterDto } from './dto';
import { generateToken, hashToken } from '@/common/utils/token';
import { refreshTokenExpiryDay } from '@/common/constants/auth.constants';
import { AppError } from '@/common/errors/app-error';
import { prisma } from '@/database/prisma/prisma';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(data: RegisterDto): Promise<RegisterResponse> {
    return await prisma.$transaction(async (tx) => {
      const existingUser = await this.repository.findUserByEmail(data.email);
      if (existingUser) {
        throw new AppError(400, 'Email already in use');
      }

      const memberRole = await this.repository.findByRoleCode(ROLE_CODE.USER);
      if (!memberRole) {
        throw new AppError(404, 'Default role not found');
      }

      const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
      const hashedPassword = await hash(data.password, bcryptSaltRounds);

      const user = await this.repository.createUser(
        {
          ...data,
          password: hashedPassword,
          roleId: memberRole.id,
        },
        tx,
      );

      return {
        email: user.email,
        name: user.name,
      };
    });
  }

  async login(
    data: LoginDto,
    accessJwt: AccessJwt,
    context: LoginContext,
  ): Promise<LoginResult> {
    const user = await this.repository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError(400, 'Invalid email or password');
    }

    const isValid = await compare(data.password, user.password);

    if (!isValid) {
      throw new AppError(400, 'Invalid email or password');
    }

    const accessToken = await accessJwt.sign({
      sub: user.id.toString(),
    });

    const refreshToken = generateToken();
    const hashedRefreshToken = hashToken(refreshToken);

    await this.repository.createRefreshToken({
      tokenHash: hashedRefreshToken,
      userId: user.id,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
      expiresAt: new Date(
        Date.now() + refreshTokenExpiryDay * 24 * 60 * 60 * 1000,
      ),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.repository.deleteRefreshToken(tokenHash);
  }

  async logoutAll(userId: number): Promise<void> {
    await this.repository.deleteUserRefreshTokens(userId);
  }

  async refresh(
    refreshToken: string,
    accessJwt: AccessJwt,
  ): Promise<LoginResult> {
    return await prisma.$transaction(async (tx) => {
      const tokenHash = hashToken(refreshToken);
      const tokenRecord = await this.repository.findRefreshToken(tokenHash);

      if (!tokenRecord) {
        throw new AppError(400, 'Invalid refresh token');
      }

      if (tokenRecord.expiresAt < new Date()) {
        await this.repository.deleteRefreshToken(tokenHash, tx);
        throw new AppError(400, 'Refresh token expired');
      }

      const accessToken = await accessJwt.sign({
        sub: tokenRecord.userId.toString(),
      });

      const newRefreshToken = generateToken();
      const hashedNewRefreshToken = hashToken(newRefreshToken);

      await this.repository.createRefreshToken(
        {
          tokenHash: hashedNewRefreshToken,
          userId: tokenRecord.userId,
          userAgent: tokenRecord.userAgent,
          ipAddress: tokenRecord.ipAddress,
          expiresAt: new Date(
            Date.now() + refreshTokenExpiryDay * 24 * 60 * 60 * 1000,
          ),
        },
        tx,
      );

      await this.repository.deleteRefreshToken(tokenHash, tx);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    });
  }
}

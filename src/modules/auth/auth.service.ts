import { compare, hash } from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { ROLE_CODE } from '@/common/constants/role.constant';
import { AccessJwt, LoginContext, LoginResponse, RegisterResponse } from './auth.type';
import { LoginDto, RegisterDto } from './dto';
import { generateToken, hashToken } from '@/common/utils/token';

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.repository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const memberRole = await this.repository.findByRoleCode(ROLE_CODE.USER);
    if (!memberRole) {
      throw new Error('Default role not found');
    }

    const bcryptSaltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const hashedPassword = await hash(data.password, bcryptSaltRounds);

    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword,
      roleId: memberRole.id,
    });

    return {
      email: user.email,
      name: user.name,
    };
  }

  async login(
    data: LoginDto,
    accessJwt: AccessJwt,
    context: LoginContext,
  ): Promise<LoginResponse> {
    const user = await this.repository.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await compare(data.password, user.password);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const accessToken = await accessJwt.sign({
      sub: user.id,
    });

    const refreshToken = generateToken();
    const hashedRefreshToken = hashToken(refreshToken);
    const refreshTokenExpiryDay = Number(
      process.env.REFRESH_TOKEN_EXPIRY_DAY ?? 7,
    );

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
}

import { hash } from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { ROLE_CODE } from '@/common/constants/role.constant';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponse } from './auth.type';

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
}

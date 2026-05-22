import { refreshTokenExpiryDay } from '@/common/constants/auth.constants';
import { AuthService } from './auth.service';
import { AccessJwt, LoginResponse, RegisterResponse } from './auth.type';
import { LoginDto, RegisterDto } from './dto';
import { AppError } from '@/common/errors/app-error';
import { ApiResponse, response } from '@/common/helpers/response.helper';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  login = async ({
    body,
    accessJwt,
    cookie,
    headers,
    request,
  }: {
    body: LoginDto;
    accessJwt: AccessJwt;
    cookie: Record<string, any>;
    headers: Record<string, string | undefined>;
    request: Request;
  }): Promise<ApiResponse<LoginResponse>> => {
    const result = await this.service.login(body, accessJwt, {
      userAgent: headers['user-agent'],

      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    cookie.refreshToken.set({
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * refreshTokenExpiryDay,
      path: '/',
    });

    return response({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
      },
    });
  };

  logout = async ({
    cookie,
  }: {
    cookie: Record<string, any>;
  }): Promise<ApiResponse<void>> => {
    const refreshToken = cookie.refreshToken.value;

    if (!refreshToken) {
      throw new AppError(400, 'Refresh token missing.');
    }

    await this.service.logout(refreshToken);
    cookie.refreshToken.remove();

    return response({
      success: true,
      message: 'Logout successful',
    });
  };

  logoutAll = async ({
    user,
    cookie,
  }: {
    user: { id: number };
    cookie: Record<string, any>;
  }): Promise<ApiResponse<void>> => {
    await this.service.logoutAll(user.id);
    cookie.refreshToken.remove();

    return response({
      success: true,
      message: 'Success logout from all devices',
    });
  };

  register = async ({
    body,
  }: {
    body: RegisterDto;
  }): Promise<ApiResponse<RegisterResponse>> => {
    const result = await this.service.register(body);
    return response({
      success: true,
      message: 'Registration successful',
      data: result,
    });
  };

  refresh = async ({
    cookie,
    accessJwt,
  }: {
    cookie: Record<string, any>;
    accessJwt: AccessJwt;
  }): Promise<ApiResponse<LoginResponse>> => {
    const refreshToken = cookie.refreshToken.value;

    if (!refreshToken) {
      throw new AppError(400, 'Refresh token missing.');
    }

    const result = await this.service.refresh(refreshToken, accessJwt);

    cookie.refreshToken.set({
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * refreshTokenExpiryDay,
      path: '/',
    });

    return response({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: result.accessToken,
      },
    });
  };
}

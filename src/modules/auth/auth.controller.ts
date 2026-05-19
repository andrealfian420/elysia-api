import { AuthService } from './auth.service';
import { AccessJwt, LoginResponse } from './auth.type';
import { LoginDto } from './dto';

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  login = async({
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
  }): Promise<LoginResponse> => {
    const result = await this.service.login(body, accessJwt, {
      userAgent: headers['user-agent'],

      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
    });

    const refreshTokenExpiryDay = Number(
      process.env.REFRESH_TOKEN_EXPIRY_DAY ?? 7,
    );

    cookie.refreshToken.set({
      value: result.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * refreshTokenExpiryDay,
      path: '/',
    });

    return {
      accessToken: result.accessToken,
    };
  }
}

export interface RegisterResponse {
  name: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginContext {
  userAgent?: string;
  ipAddress?: string;
}

export interface AccessJwt {
  sign(payload: object): Promise<string> | string;
}

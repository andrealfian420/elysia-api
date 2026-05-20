export interface RegisterResponse {
  name: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface LoginContext {
  userAgent?: string;
  ipAddress?: string;
}

export interface AccessJwt {
  sign(payload: Record<string, unknown>): Promise<string>;
}

export interface RoleData {
  id: number;
  name: string;
  access: string[];
}

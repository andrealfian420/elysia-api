export const ROLE_CODE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
} as const;

export type RoleCode = (typeof ROLE_CODE)[keyof typeof ROLE_CODE];

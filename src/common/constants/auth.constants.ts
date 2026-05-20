import 'dotenv/config';

export const refreshTokenExpiryDay = Number(
  process.env.REFRESH_TOKEN_EXPIRY_DAY ?? 7,
);

import { createHash, randomBytes } from 'crypto';

export function generateToken(): string {
  return randomBytes(128).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

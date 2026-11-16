import * as jose from 'jose';
import { UserRole } from '@majuligo/shared';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'majuligo-dev-super-secure-secret-key-32-chars-min';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AuthTokenPayload {
  userId: string;
  phoneNumber: string;
  role: UserRole;
  tokenType: 'access' | 'refresh';
}

/**
 * Generates an Access Token (default: 7 days)
 */
export async function generateAccessToken(payload: Omit<AuthTokenPayload, 'tokenType'>): Promise<string> {
  return await new jose.SignJWT({
    userId: payload.userId,
    phoneNumber: payload.phoneNumber,
    role: payload.role,
    tokenType: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('in.majuligo.backend')
    .setAudience('in.majuligo.app')
    .setExpirationTime(process.env.JWT_ACCESS_EXPIRES_IN || '7d')
    .sign(JWT_SECRET);
}

/**
 * Generates a Refresh Token (default: 30 days)
 */
export async function generateRefreshToken(payload: Omit<AuthTokenPayload, 'tokenType'>): Promise<string> {
  return await new jose.SignJWT({
    userId: payload.userId,
    phoneNumber: payload.phoneNumber,
    role: payload.role,
    tokenType: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('in.majuligo.backend')
    .setAudience('in.majuligo.app')
    .setExpirationTime(process.env.JWT_REFRESH_EXPIRES_IN || '30d')
    .sign(JWT_SECRET);
}

/**
 * Verifies any MajuliGo JWT token
 */
export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: 'in.majuligo.backend',
      audience: 'in.majuligo.app',
    });

    return {
      userId: payload.userId as string,
      phoneNumber: payload.phoneNumber as string,
      role: payload.role as UserRole,
      tokenType: payload.tokenType as 'access' | 'refresh',
    };
  } catch {
    return null;
  }
}

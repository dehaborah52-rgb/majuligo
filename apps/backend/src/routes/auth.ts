import { FastifyInstance } from 'fastify';
import { PhoneSchema, UserRole } from '@majuligo/shared';
import { generateAccessToken, generateRefreshToken, verifyAuthToken } from '../auth/jwt.js';
import { inMemoryUsers } from './users.js';

// OTP storage for development/mock mode (phone -> code)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function authRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/auth/send-otp
   */
  fastify.post('/send-otp', async (request, reply) => {
    const rawPhone = (request.body as any)?.phoneNumber || (request.body as any)?.phone;
    const parseResult = PhoneSchema.safeParse(rawPhone);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_PHONE_NUMBER',
        message: 'Must be a valid 10-digit Indian phone number',
        details: parseResult.error.format(),
      });
    }

    const phoneNumber = parseResult.data;
    const isMock = process.env.OTP_PROVIDER === 'mock' || !process.env.OTP_PROVIDER;
    const otpCode = isMock ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5 minute expiration
    otpStore.set(phoneNumber, {
      code: otpCode,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return reply.send({
      success: true,
      message: `OTP sent successfully to ${phoneNumber}`,
      debugCode: isMock ? otpCode : undefined,
    });
  });

  /**
   * POST /api/v1/auth/verify-otp
   */
  fastify.post('/verify-otp', async (request, reply) => {
    const body = request.body as any;
    const rawPhone = body?.phoneNumber || body?.phone;
    const phoneResult = PhoneSchema.safeParse(rawPhone);
    const otp = typeof body?.otp === 'string' ? body.otp.trim() : '';
    const requestedRole: UserRole = body?.role === UserRole.CAPTAIN ? UserRole.CAPTAIN : UserRole.RIDER;

    if (!phoneResult.success || !/^\d{6}$/.test(otp)) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Valid phone number and 6-digit numeric OTP are required',
      });
    }

    const phoneNumber = phoneResult.data;
    const storedOtp = otpStore.get(phoneNumber);
    const isMock = process.env.OTP_PROVIDER === 'mock' || !process.env.OTP_PROVIDER;

    const isValid = (isMock && otp === '123456') || (storedOtp && storedOtp.code === otp && storedOtp.expiresAt > Date.now());

    if (!isValid) {
      return reply.status(401).send({
        success: false,
        error: 'INVALID_OR_EXPIRED_OTP',
        message: 'The OTP entered is invalid or has expired',
      });
    }

    // OTP verified: clean up
    otpStore.delete(phoneNumber);

    // Look up or create user in inMemoryUsers
    let user = Array.from(inMemoryUsers.values()).find((u) => u.phoneNumber === phoneNumber);
    if (!user) {
      user = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        phoneNumber,
        fullName: null,
        role: requestedRole,
        isActive: true,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryUsers.set(user.id, user);
    }

    // Generate real JWT tokens
    const accessToken = await generateAccessToken({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    return reply.send({
      success: true,
      message: 'Authentication successful',
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        role: user.role,
      },
    });
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  fastify.post('/refresh-token', async (request, reply) => {
    const body = request.body as { refreshToken?: string };
    if (!body || !body.refreshToken) {
      return reply.status(400).send({
        success: false,
        error: 'MISSING_REFRESH_TOKEN',
        message: 'refreshToken is required in request body',
      });
    }

    const payload = await verifyAuthToken(body.refreshToken);
    if (!payload || payload.tokenType !== 'refresh') {
      return reply.status(401).send({
        success: false,
        error: 'INVALID_REFRESH_TOKEN',
        message: 'Refresh token is expired or invalid',
      });
    }

    // Issue new access token
    const newAccessToken = await generateAccessToken({
      userId: payload.userId,
      phoneNumber: payload.phoneNumber,
      role: payload.role,
    });

    return reply.send({
      success: true,
      token: newAccessToken,
    });
  });
}

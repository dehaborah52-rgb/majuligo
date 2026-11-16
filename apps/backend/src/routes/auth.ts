import { FastifyInstance } from 'fastify';
import { SendOtpSchema, VerifyOtpSchema, UserRole } from '@majuligo/shared';
import { config } from '../config.js';

export async function authRoutes(app: FastifyInstance) {
  // Request OTP endpoint
  app.post('/api/v1/auth/send-otp', async (request, reply) => {
    const parseResult = SendOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { phone, role } = parseResult.data;

    // In development or mock mode, we do not waste SMS credits
    return reply.status(200).send({
      success: true,
      message: `OTP sent to +91 ${phone}`,
      devOtpHint: config.OTP_PROVIDER === 'mock' ? config.OTP_DEFAULT_DEV_CODE : undefined,
      phone,
      role,
    });
  });

  // Verify OTP endpoint
  app.post('/api/v1/auth/verify-otp', async (request, reply) => {
    const parseResult = VerifyOtpSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { phone, otp, role } = parseResult.data;

    // Verify OTP against mock or stored state
    const isValid = config.OTP_PROVIDER === 'mock' && otp === config.OTP_DEFAULT_DEV_CODE;

    if (!isValid) {
      return reply.status(401).send({
        error: 'Invalid or expired OTP',
      });
    }

    return reply.status(200).send({
      success: true,
      message: 'Authentication successful',
      token: `dummy-jwt-token-phase-1-${phone}-${Date.now()}`,
      user: {
        id: 'usr_phase1_test_id',
        phone,
        role: role ?? UserRole.RIDER,
        isActive: true,
      },
    });
  });
}

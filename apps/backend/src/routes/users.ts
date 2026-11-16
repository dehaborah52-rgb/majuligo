import { FastifyInstance } from 'fastify';
import { UserRole } from '@majuligo/shared';
import { authenticate } from '../auth/middleware.js';
import { queryDb } from '../db/pool.js';

// In-memory store for dev/testing when DATABASE_URL is not set
export const inMemoryUsers = new Map<string, {
  id: string;
  phoneNumber: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}>();

export async function userRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/v1/users/me
   * Fetches the profile of the authenticated user
   */
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.userId;

    // Check DB or in-memory
    const dbUser = (await queryDb('SELECT id, phone_number, full_name, role, is_active FROM users WHERE id = $1', [userId]))[0];
    if (dbUser) {
      return reply.send({
        success: true,
        user: {
          id: dbUser.id,
          phoneNumber: dbUser.phone_number,
          fullName: dbUser.full_name,
          role: dbUser.role,
          isActive: dbUser.is_active,
        },
      });
    }

    const memUser = inMemoryUsers.get(userId);
    if (memUser && !memUser.isDeleted) {
      return reply.send({
        success: true,
        user: {
          id: memUser.id,
          phoneNumber: memUser.phoneNumber,
          fullName: memUser.fullName,
          role: memUser.role,
          isActive: memUser.isActive,
        },
      });
    }

    return reply.status(404).send({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User account not found',
    });
  });

  /**
   * PATCH /api/v1/users/me
   * Updates user name / profile
   */
  fastify.patch('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.userId;
    const body = request.body as { fullName?: string };

    if (!body || typeof body.fullName !== 'string') {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_INPUT',
        message: 'fullName is required as a string',
      });
    }

    // Try update in DB
    const dbUpdated = (await queryDb(
      'UPDATE users SET full_name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, phone_number, full_name, role',
      [body.fullName.trim(), userId]
    ))[0];

    if (dbUpdated) {
      return reply.send({
        success: true,
        user: {
          id: dbUpdated.id,
          phoneNumber: dbUpdated.phone_number,
          fullName: dbUpdated.full_name,
          role: dbUpdated.role,
        },
      });
    }

    // Update in-memory
    const memUser = inMemoryUsers.get(userId);
    if (memUser && !memUser.isDeleted) {
      memUser.fullName = body.fullName.trim();
      memUser.updatedAt = new Date().toISOString();
      return reply.send({
        success: true,
        user: {
          id: memUser.id,
          phoneNumber: memUser.phoneNumber,
          fullName: memUser.fullName,
          role: memUser.role,
        },
      });
    }

    return reply.status(404).send({
      success: false,
      error: 'USER_NOT_FOUND',
      message: 'User account not found',
    });
  });

  /**
   * DELETE /api/v1/users/me
   * Account Deletion Endpoint (Strict Google Play Store compliance)
   */
  fastify.delete('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.userId;

    // Soft delete in PostgreSQL
    await queryDb('UPDATE users SET is_deleted = TRUE, is_active = FALSE, updated_at = NOW() WHERE id = $1', [userId]);

    // Soft delete in-memory
    const memUser = inMemoryUsers.get(userId);
    if (memUser) {
      memUser.isDeleted = true;
      memUser.isActive = false;
      memUser.updatedAt = new Date().toISOString();
    }

    return reply.send({
      success: true,
      message: 'User account and associated personal data marked for permanent deletion.',
    });
  });
}

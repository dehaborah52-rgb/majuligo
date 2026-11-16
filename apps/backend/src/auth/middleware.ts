import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@majuligo/shared';
import { verifyAuthToken, AuthTokenPayload } from './jwt.js';

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthTokenPayload;
  }
}

/**
 * Fastify hook/middleware to require valid JWT authentication
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or malformed Authorization header with Bearer token',
    });
  }

  const token = authHeader.substring(7);
  const payload = await verifyAuthToken(token);

  if (!payload || payload.tokenType !== 'access') {
    return reply.status(401).send({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Access token is invalid or expired',
    });
  }

  request.user = payload;
}

/**
 * Fastify preHandler to check for specific roles
 */
export function requireRoles(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: 'FORBIDDEN',
        message: `User role '${request.user.role}' is not authorized to access this resource`,
      });
    }
  };
}

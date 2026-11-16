import { FastifyInstance } from 'fastify';
import { UserRole, CaptainVerificationStatus } from '@majuligo/shared';
import { authenticate, requireRoles } from '../auth/middleware.js';
import { queryDb } from '../db/pool.js';
import { inMemoryUsers } from './users.js';

export interface CaptainRecord {
  userId: string;
  drivingLicenseNumber: string;
  vehiclePlate: string;
  vehicleModel: string;
  verificationStatus: CaptainVerificationStatus;
  isOnline: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  dailyEarnings: number;
}

export const inMemoryCaptains = new Map<string, CaptainRecord>();

// Pre-seed mock approved captain for dev & testing in Majuli
inMemoryCaptains.set('usr_cpt_101', {
  userId: 'usr_cpt_101',
  drivingLicenseNumber: 'AS-03-2021008291',
  vehiclePlate: 'AS-03-AB-4412',
  vehicleModel: 'Hero Splendor Plus',
  verificationStatus: CaptainVerificationStatus.APPROVED,
  isOnline: true,
  currentLatitude: 26.9602,
  currentLongitude: 94.1751,
  dailyEarnings: 840,
});

export async function captainRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/captains/register
   */
  fastify.post('/register', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user!;
    const body = request.body as {
      drivingLicenseNumber?: string;
      vehiclePlate?: string;
      vehicleModel?: string;
    };

    if (!body?.drivingLicenseNumber || !body?.vehiclePlate || !body?.vehicleModel) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_CAPTAIN_DATA',
        message: 'drivingLicenseNumber, vehiclePlate, and vehicleModel are required',
      });
    }

    // Update user role to CAPTAIN
    const memUser = inMemoryUsers.get(user.userId);
    if (memUser) {
      memUser.role = UserRole.CAPTAIN;
    }

    const captainProfile: CaptainRecord = {
      userId: user.userId,
      drivingLicenseNumber: body.drivingLicenseNumber.trim().toUpperCase(),
      vehiclePlate: body.vehiclePlate.trim().toUpperCase(),
      vehicleModel: body.vehicleModel.trim(),
      verificationStatus: CaptainVerificationStatus.PENDING_VERIFICATION,
      isOnline: false,
      dailyEarnings: 0,
    };

    inMemoryCaptains.set(user.userId, captainProfile);

    // Save in DB if available
    await queryDb(
      `INSERT INTO captain_profiles (user_id, driving_licence_number, verification_status)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET driving_licence_number = $2, verification_status = $3`,
      [user.userId, captainProfile.drivingLicenseNumber, captainProfile.verificationStatus]
    );

    return reply.status(201).send({
      success: true,
      message: 'Captain registration submitted and awaiting document verification',
      captain: captainProfile,
    });
  });

  /**
   * GET /api/v1/captains/profile
   */
  fastify.get('/profile', { preHandler: [authenticate] }, async (request, reply) => {
    const userId = request.user!.userId;
    const profile = inMemoryCaptains.get(userId);

    if (!profile) {
      return reply.status(404).send({
        success: false,
        error: 'CAPTAIN_NOT_FOUND',
        message: 'No captain profile found for this user',
      });
    }

    return reply.send({
      success: true,
      captain: profile,
    });
  });

  /**
   * POST /api/v1/captains/toggle-online
   */
  fastify.post('/toggle-online', { preHandler: [authenticate, requireRoles([UserRole.CAPTAIN, UserRole.ADMIN])] }, async (request, reply) => {
    const userId = request.user!.userId;
    const profile = inMemoryCaptains.get(userId);

    if (!profile) {
      return reply.status(404).send({
        success: false,
        error: 'CAPTAIN_NOT_FOUND',
        message: 'No captain profile found',
      });
    }

    if (profile.verificationStatus !== CaptainVerificationStatus.APPROVED) {
      return reply.status(403).send({
        success: false,
        error: 'UNVERIFIED_CAPTAIN',
        message: 'Only approved captains can go online to receive rides',
      });
    }

    profile.isOnline = !profile.isOnline;

    return reply.send({
      success: true,
      isOnline: profile.isOnline,
      message: profile.isOnline ? 'You are now online and ready for rides' : 'You are now offline',
    });
  });

  /**
   * POST /api/v1/captains/location
   */
  fastify.post('/location', { preHandler: [authenticate, requireRoles([UserRole.CAPTAIN])] }, async (request, reply) => {
    const userId = request.user!.userId;
    const { latitude, longitude } = request.body as { latitude: number; longitude: number };

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_COORDINATES',
        message: 'Valid latitude and longitude are required',
      });
    }

    const profile = inMemoryCaptains.get(userId);
    if (profile) {
      profile.currentLatitude = latitude;
      profile.currentLongitude = longitude;
    }

    return reply.send({ success: true, updated: true });
  });
}

import { FastifyInstance } from 'fastify';
import {
  CreateRideRequestSchema,
  calculateFare,
  RideStatus,
  PaymentMethod,
  UserRole,
} from '@majuligo/shared';
import { authenticate, requireRoles } from '../auth/middleware.js';
import { inMemoryCaptains } from './captains.js';
import { emitRideEvent } from '../socket.js';

export interface RideRecord {
  id: string;
  riderId: string;
  captainId?: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  totalFare: number;
  captainEarnings: number;
  platformCommission: number;
  status: RideStatus;
  otp: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export const inMemoryRides = new Map<string, RideRecord>();

// Pre-seed sample ride
inMemoryRides.set('ride_001', {
  id: 'ride_001',
  riderId: 'usr_rider_1',
  captainId: 'usr_cpt_101',
  pickupAddress: 'Kamalabari Ghat, Majuli',
  pickupLatitude: 26.9602,
  pickupLongitude: 94.1751,
  destinationAddress: 'Garamur Satra, Majuli',
  destinationLatitude: 26.9834,
  destinationLongitude: 94.2052,
  estimatedDistanceKm: 12.4,
  estimatedDurationMins: 25,
  totalFare: 149,
  captainEarnings: 126.65,
  platformCommission: 22.35,
  status: RideStatus.IN_PROGRESS,
  otp: '4821',
  paymentMethod: PaymentMethod.CASH,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function calculateDistanceAndDuration(pickupLat: number, pickupLng: number, destLat: number, destLng: number) {
  const latDiff = (destLat - pickupLat) * 111;
  const lngDiff = (destLng - pickupLng) * (111 * Math.cos((pickupLat * Math.PI) / 180));
  const distanceKm = Math.max(1.0, parseFloat(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff).toFixed(1)));
  const durationMins = Math.max(3, Math.round(distanceKm * 2.2));
  return { distanceKm, durationMins };
}

export async function rideRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/v1/rides/estimate-fare
   */
  fastify.post('/estimate-fare', async (request, reply) => {
    const parseResult = CreateRideRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_RIDE_REQUEST',
        message: 'Invalid coordinate or ride payload',
        details: parseResult.error.format(),
      });
    }

    const { pickup, destination } = parseResult.data;
    const { distanceKm, durationMins } = calculateDistanceAndDuration(
      pickup.latitude,
      pickup.longitude,
      destination.latitude,
      destination.longitude
    );

    const fare = calculateFare({
      distanceKm,
      durationMinutes: durationMins,
    });

    return reply.send({
      success: true,
      estimation: {
        distanceKm,
        durationMinutes: durationMins,
        fare,
      },
    });
  });

  /**
   * POST /api/v1/rides/book
   */
  fastify.post('/book', { preHandler: [authenticate] }, async (request, reply) => {
    const user = request.user!;
    const parseResult = CreateRideRequestSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_RIDE_REQUEST',
        details: parseResult.error.format(),
      });
    }

    const reqData = parseResult.data;
    const { distanceKm, durationMins } = calculateDistanceAndDuration(
      reqData.pickup.latitude,
      reqData.pickup.longitude,
      reqData.destination.latitude,
      reqData.destination.longitude
    );

    const fare = calculateFare({
      distanceKm,
      durationMinutes: durationMins,
    });

    const rideId = `ride_${Date.now()}`;
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newRide: RideRecord = {
      id: rideId,
      riderId: user.userId,
      pickupAddress: reqData.pickup.address || `${reqData.pickup.latitude}, ${reqData.pickup.longitude}`,
      pickupLatitude: reqData.pickup.latitude,
      pickupLongitude: reqData.pickup.longitude,
      destinationAddress: reqData.destination.address || `${reqData.destination.latitude}, ${reqData.destination.longitude}`,
      destinationLatitude: reqData.destination.latitude,
      destinationLongitude: reqData.destination.longitude,
      estimatedDistanceKm: distanceKm,
      estimatedDurationMins: durationMins,
      totalFare: fare.totalFare,
      captainEarnings: fare.captainEarnings,
      platformCommission: fare.platformCommission,
      status: RideStatus.SEARCHING,
      otp: startOtp,
      paymentMethod: reqData.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryRides.set(rideId, newRide);

    // Broadcast to online captains radar
    emitRideEvent('ride:requested', {
      rideId: newRide.id,
      pickupAddress: newRide.pickupAddress,
      destinationAddress: newRide.destinationAddress,
      totalFare: newRide.totalFare,
      captainEarnings: newRide.captainEarnings,
      distanceKm: newRide.estimatedDistanceKm,
      durationMins: newRide.estimatedDurationMins,
    });

    return reply.status(201).send({
      success: true,
      message: 'Ride requested successfully. Searching for nearby captains in Majuli...',
      ride: newRide,
    });
  });

  /**
   * POST /api/v1/rides/:rideId/accept
   */
  fastify.post('/:rideId/accept', { preHandler: [authenticate, requireRoles([UserRole.CAPTAIN])] }, async (request, reply) => {
    const { rideId } = request.params as { rideId: string };
    const captainId = request.user!.userId;

    const ride = inMemoryRides.get(rideId);
    if (!ride) {
      return reply.status(404).send({ success: false, error: 'RIDE_NOT_FOUND' });
    }

    if (ride.status !== RideStatus.SEARCHING && ride.status !== RideStatus.PENDING) {
      return reply.status(409).send({
        success: false,
        error: 'RIDE_ALREADY_ASSIGNED',
        message: 'This ride has already been accepted by another captain',
      });
    }

    ride.status = RideStatus.ACCEPTED;
    ride.captainId = captainId;
    ride.updatedAt = new Date().toISOString();

    emitRideEvent('ride:accepted', { rideId: ride.id, captainId });

    return reply.send({
      success: true,
      message: 'Ride successfully assigned to you',
      ride,
    });
  });

  /**
   * POST /api/v1/rides/:rideId/start
   */
  fastify.post('/:rideId/start', { preHandler: [authenticate, requireRoles([UserRole.CAPTAIN])] }, async (request, reply) => {
    const { rideId } = request.params as { rideId: string };
    const { otp } = request.body as { otp: string };

    const ride = inMemoryRides.get(rideId);
    if (!ride) {
      return reply.status(404).send({ success: false, error: 'RIDE_NOT_FOUND' });
    }

    if (ride.otp !== otp) {
      return reply.status(400).send({
        success: false,
        error: 'INVALID_RIDE_OTP',
        message: 'Incorrect 4-digit ride verification OTP from rider',
      });
    }

    ride.status = RideStatus.IN_PROGRESS;
    ride.updatedAt = new Date().toISOString();

    emitRideEvent('ride:started', { rideId: ride.id });

    return reply.send({
      success: true,
      message: 'Trip started successfully',
      ride,
    });
  });

  /**
   * POST /api/v1/rides/:rideId/complete
   */
  fastify.post('/:rideId/complete', { preHandler: [authenticate, requireRoles([UserRole.CAPTAIN])] }, async (request, reply) => {
    const { rideId } = request.params as { rideId: string };

    const ride = inMemoryRides.get(rideId);
    if (!ride) {
      return reply.status(404).send({ success: false, error: 'RIDE_NOT_FOUND' });
    }

    ride.status = RideStatus.COMPLETED;
    ride.updatedAt = new Date().toISOString();

    if (ride.captainId) {
      const captain = inMemoryCaptains.get(ride.captainId);
      if (captain) {
        captain.dailyEarnings += ride.captainEarnings;
      }
    }

    emitRideEvent('ride:completed', {
      rideId: ride.id,
      totalFare: ride.totalFare,
      captainEarnings: ride.captainEarnings,
    });

    return reply.send({
      success: true,
      message: 'Trip completed successfully',
      receipt: {
        rideId: ride.id,
        totalFare: ride.totalFare,
        captainEarnings: ride.captainEarnings,
        platformCommission: ride.platformCommission,
        paymentMethod: ride.paymentMethod,
        completedAt: ride.updatedAt,
      },
    });
  });

  /**
   * POST /api/v1/rides/:rideId/cancel
   */
  fastify.post('/:rideId/cancel', { preHandler: [authenticate] }, async (request, reply) => {
    const { rideId } = request.params as { rideId: string };
    const { reason } = (request.body as { reason?: string }) || {};

    const ride = inMemoryRides.get(rideId);
    if (!ride) {
      return reply.status(404).send({ success: false, error: 'RIDE_NOT_FOUND' });
    }

    if (ride.status === RideStatus.COMPLETED) {
      return reply.status(400).send({
        success: false,
        error: 'CANNOT_CANCEL_COMPLETED_RIDE',
        message: 'Completed rides cannot be cancelled',
      });
    }

    ride.status = RideStatus.CANCELLED;
    ride.updatedAt = new Date().toISOString();

    emitRideEvent('ride:cancelled', { rideId: ride.id, reason });

    return reply.send({
      success: true,
      message: 'Ride cancelled successfully',
      ride,
    });
  });

  /**
   * GET /api/v1/rides/:rideId
   */
  fastify.get('/:rideId', { preHandler: [authenticate] }, async (request, reply) => {
    const { rideId } = request.params as { rideId: string };
    const ride = inMemoryRides.get(rideId);

    if (!ride) {
      return reply.status(404).send({ success: false, error: 'RIDE_NOT_FOUND' });
    }

    return reply.send({
      success: true,
      ride,
    });
  });
}

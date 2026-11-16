import { FastifyInstance } from 'fastify';
import {
  EstimateFareRequestSchema,
  CreateRideRequestSchema,
  calculateFare,
  RideStatus,
  PaymentStatus,
  PaymentMethod,
} from '@majuligo/shared';

export async function rideRoutes(app: FastifyInstance) {
  // Estimate fare based on pickup and destination
  app.post('/api/v1/rides/estimate-fare', async (request, reply) => {
    const parseResult = EstimateFareRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { pickup, destination } = parseResult.data;

    // Calculate approximate Haversine distance in km
    const dLat = ((destination.latitude - pickup.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - pickup.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLineKm = 6371 * c;

    // Road factor adjustment (Majuli road network factor ~1.3x straight line)
    const roadDistanceKm = Math.max(0.8, Math.round(straightLineKm * 1.3 * 10) / 10);
    // Estimated average speed: 30 km/h in island conditions
    const durationMinutes = Math.max(3, Math.round((roadDistanceKm / 30) * 60));

    const breakdown = calculateFare({
      distanceKm: roadDistanceKm,
      durationMinutes,
    });

    return reply.status(200).send({
      success: true,
      pickup,
      destination,
      estimatedDistanceKm: roadDistanceKm,
      estimatedDurationMinutes: durationMinutes,
      fare: breakdown,
    });
  });

  // Create Ride Booking Request
  app.post('/api/v1/rides/create', async (request, reply) => {
    const parseResult = CreateRideRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'Validation Error',
        details: parseResult.error.errors,
      });
    }

    const { pickup, destination, paymentMethod } = parseResult.data;

    const rideId = `ride_${Date.now()}`;
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP

    return reply.status(201).send({
      success: true,
      ride: {
        id: rideId,
        status: RideStatus.SEARCHING,
        pickup,
        destination,
        paymentMethod: paymentMethod ?? PaymentMethod.CASH,
        paymentStatus: PaymentStatus.PENDING,
        startOtp,
        createdAt: new Date().toISOString(),
      },
    });
  });
}

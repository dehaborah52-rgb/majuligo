import { DEFAULT_FARE_RULES, CURRENCY_SYMBOL } from './constants.js';
import { FareBreakdown } from './types.js';

export interface FareCalculationInput {
  distanceKm: number;
  durationMinutes: number;
  baseFare?: number;
  baseIncludedKm?: number;
  perKmRate?: number;
  perMinuteRate?: number;
  minimumFare?: number;
  commissionPercent?: number;
}

/**
 * Calculates deterministic fare breakdown for a bike-taxi ride
 */
export function calculateFare(input: FareCalculationInput): FareBreakdown {
  const baseFare = input.baseFare ?? DEFAULT_FARE_RULES.baseFare;
  const baseIncludedKm = input.baseIncludedKm ?? DEFAULT_FARE_RULES.baseIncludedKm;
  const perKmRate = input.perKmRate ?? DEFAULT_FARE_RULES.perKmRate;
  const perMinuteRate = input.perMinuteRate ?? DEFAULT_FARE_RULES.perMinuteRate;
  const minimumFare = input.minimumFare ?? DEFAULT_FARE_RULES.minimumFare;
  const commissionPercent =
    input.commissionPercent ?? DEFAULT_FARE_RULES.platformCommissionPercent;

  // Additional km beyond base included km
  const extraKm = Math.max(0, input.distanceKm - baseIncludedKm);
  const distanceFare = Math.round(extraKm * perKmRate * 100) / 100;
  const timeFare = Math.round(input.durationMinutes * perMinuteRate * 100) / 100;

  let subtotal = baseFare + distanceFare + timeFare;
  if (subtotal < minimumFare) {
    subtotal = minimumFare;
  }

  // Rounded to nearest whole rupee for convenient cash/UPI transactions in India
  const totalFare = Math.round(subtotal);
  const platformCommission = Math.round((totalFare * commissionPercent) / 100);
  const captainEarnings = totalFare - platformCommission;

  return {
    baseFare,
    distanceKm: Math.round(input.distanceKm * 10) / 10,
    distanceFare,
    durationMinutes: Math.round(input.durationMinutes),
    timeFare,
    subtotal,
    taxes: 0,
    totalFare,
    currency: CURRENCY_SYMBOL,
    platformCommission,
    captainEarnings,
  };
}

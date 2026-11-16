import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PhoneSchema,
  VerifyOtpSchema,
  calculateFare,
  UserRole,
  RideStatus,
  DESIGN_TOKENS,
  translate,
} from './index.js';

test('PhoneSchema validates and normalizes Indian mobile numbers', () => {
  // Valid 10-digit number
  assert.equal(PhoneSchema.parse('9876543210'), '9876543210');
  
  // Valid number with +91 prefix
  assert.equal(PhoneSchema.parse('+919876543210'), '9876543210');
  
  // Valid number with 91 prefix
  assert.equal(PhoneSchema.parse('919876543210'), '9876543210');

  // Invalid numbers
  assert.throws(() => PhoneSchema.parse('1234567890')); // Starts with 1
  assert.throws(() => PhoneSchema.parse('98765')); // Too short
  assert.throws(() => PhoneSchema.parse('abc9876543210')); // Non-digit
});

test('VerifyOtpSchema validates 6-digit numeric OTP', () => {
  const valid = VerifyOtpSchema.parse({
    phone: '9876543210',
    otp: '123456',
    role: UserRole.RIDER,
  });
  assert.equal(valid.otp, '123456');

  assert.throws(() =>
    VerifyOtpSchema.parse({
      phone: '9876543210',
      otp: '12345', // 5 digits
      role: UserRole.RIDER,
    })
  );
});

test('calculateFare returns accurate fare and captain earnings', () => {
  // Test short 1 km ride (less than base 1.5 km)
  const shortRide = calculateFare({
    distanceKm: 1.0,
    durationMinutes: 4,
  });
  // Base fare (20) + time (4 * 1 = 4) = 24. Since min fare is 25, total = 25
  assert.equal(shortRide.totalFare, 25);
  // Platform commission: 15% of 25 = 4
  assert.equal(shortRide.platformCommission, 4);
  assert.equal(shortRide.captainEarnings, 21);

  // Test 10 km ride from Kamalabari to Garamur (approx 20 mins)
  const typicalRide = calculateFare({
    distanceKm: 10.0,
    durationMinutes: 20,
  });
  assert.equal(typicalRide.totalFare, 125);
  assert.equal(typicalRide.platformCommission, 19);
  assert.equal(typicalRide.captainEarnings, 106);
});

test('RideStatus enum has all required states', () => {
  assert.equal(RideStatus.PENDING, 'PENDING');
  assert.equal(RideStatus.SEARCHING, 'SEARCHING');
  assert.equal(RideStatus.ACCEPTED, 'ACCEPTED');
  assert.equal(RideStatus.ARRIVED, 'ARRIVED');
  assert.equal(RideStatus.IN_PROGRESS, 'IN_PROGRESS');
  assert.equal(RideStatus.COMPLETED, 'COMPLETED');
  assert.equal(RideStatus.CANCELLED, 'CANCELLED');
});

test('DESIGN_TOKENS exports accessible color and touch dimensions', () => {
  assert.equal(DESIGN_TOKENS.colors.primary, '#F59E0B');
  assert.equal(DESIGN_TOKENS.colors.secondary, '#10B981');
  assert.equal(DESIGN_TOKENS.touchTarget.minHeight, 48);
  assert.equal(DESIGN_TOKENS.touchTarget.minWidth, 48);
});

test('translate returns localized strings and falls back gracefully', () => {
  // English
  assert.equal(translate('brandName', 'en'), 'MajuliGo');
  assert.equal(translate('confirmBooking', 'en'), 'Book MajuliGo Bike Taxi');

  // Assamese
  assert.equal(translate('brandName', 'as'), 'মাজুলী গ’');
  assert.equal(translate('confirmBooking', 'as'), 'বাইক টেক্সি বুক কৰক');

  // Hindi
  assert.equal(translate('brandName', 'hi'), 'माजुली गो');
  assert.equal(translate('confirmBooking', 'hi'), 'बाइक टैक्सी बुक करें');
});

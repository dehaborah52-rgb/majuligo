/**
 * MajuliGo Core Domain Enums
 */

export enum UserRole {
  RIDER = 'RIDER',
  CAPTAIN = 'CAPTAIN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPORT = 'SUPPORT',
}

export enum RideStatus {
  /** Ride created by rider, pending captain search */
  PENDING = 'PENDING',
  /** System actively broadcasting to nearby eligible captains */
  SEARCHING = 'SEARCHING',
  /** A captain accepted the ride */
  ACCEPTED = 'ACCEPTED',
  /** Captain arrived at the rider's pickup location */
  ARRIVED = 'ARRIVED',
  /** Ride is in progress (OTP verified by captain) */
  IN_PROGRESS = 'IN_PROGRESS',
  /** Ride arrived at destination and was completed */
  COMPLETED = 'COMPLETED',
  /** Ride was cancelled */
  CANCELLED = 'CANCELLED',
}

export enum CaptainVerificationStatus {
  /** New registration awaiting admin review */
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  /** Approved by admin, allowed to go online & take rides */
  APPROVED = 'APPROVED',
  /** Rejected by admin with specific feedback */
  REJECTED = 'REJECTED',
  /** Temporarily or permanently suspended due to violation */
  SUSPENDED = 'SUSPENDED',
}

export enum VehicleType {
  BIKE = 'BIKE',
  AUTO = 'AUTO',
  CAB = 'CAB',
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  WALLET = 'WALLET',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CancellationParty {
  RIDER = 'RIDER',
  CAPTAIN = 'CAPTAIN',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

export enum DocumentType {
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  VEHICLE_REGISTRATION_RC = 'VEHICLE_REGISTRATION_RC',
  VEHICLE_INSURANCE = 'VEHICLE_INSURANCE',
  AADHAAR_CARD = 'AADHAAR_CARD',
  PAN_CARD = 'PAN_CARD',
  VEHICLE_PHOTO = 'VEHICLE_PHOTO',
}

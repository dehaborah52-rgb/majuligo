import {
  UserRole,
  RideStatus,
  CaptainVerificationStatus,
  VehicleType,
  PaymentMethod,
  PaymentStatus,
  CancellationParty,
  DocumentType,
} from './enums.js';

export interface GeoPoint {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  email?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaptainProfile {
  id: string;
  userId: string;
  drivingLicenceNumber: string;
  dlExpiryDate?: string | null;
  verificationStatus: CaptainVerificationStatus;
  rejectionReason?: string | null;
  isOnline: boolean;
  currentLocation?: GeoPoint | null;
  rating: number;
  totalRides: number;
  totalEarnings: number;
  vehicle?: VehicleDetails | null;
  user?: UserProfile | null;
  createdAt: string;
}

export interface VehicleDetails {
  id: string;
  captainId: string;
  registrationNumber: string;
  makeModel: string;
  color?: string | null;
  vehicleType: VehicleType;
  photoUrl?: string | null;
}

export interface CaptainDocument {
  id: string;
  captainId: string;
  documentType: DocumentType;
  documentUrl: string;
  status: CaptainVerificationStatus;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

export interface FareBreakdown {
  baseFare: number;
  distanceKm: number;
  distanceFare: number;
  durationMinutes: number;
  timeFare: number;
  subtotal: number;
  taxes: number;
  totalFare: number;
  currency: string;
  platformCommission: number;
  captainEarnings: number;
}

export interface RideRecord {
  id: string;
  riderId: string;
  captainId?: string | null;
  serviceAreaId: string;
  status: RideStatus;
  pickup: GeoPoint;
  destination: GeoPoint;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  estimatedFare: number;
  finalFare?: number | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  startOtp: string; // 4-digit code shown to rider, entered by captain
  cancellationReason?: string | null;
  cancelledBy?: CancellationParty | null;
  rider?: UserProfile | null;
  captain?: CaptainProfile | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  minimumFare: number;
  commissionPercent: number;
  isActive: boolean;
}

export interface CaptainLocationUpdate {
  captainId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

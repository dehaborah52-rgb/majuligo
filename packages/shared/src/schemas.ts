import { z } from 'zod';
import {
  UserRole,
  PaymentMethod,
  VehicleType,
  CancellationParty,
  DocumentType,
} from './enums.js';

/**
 * Standard Indian 10-digit mobile number validation
 * Accepts 10 digits starting with 6, 7, 8, or 9 (with optional +91 prefix)
 */
export const PhoneSchema = z
  .string()
  .transform((val) => val.trim().replace(/^(\+91|91)/, ''))
  .pipe(
    z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'
      )
  );

export const SendOtpSchema = z.object({
  phone: PhoneSchema,
  role: z.nativeEnum(UserRole).default(UserRole.RIDER),
});

export const VerifyOtpSchema = z.object({
  phone: PhoneSchema,
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
  role: z.nativeEnum(UserRole).default(UserRole.RIDER),
});

export const GeoPointSchema = z.object({
  latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
  address: z.string().optional(),
  name: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address').optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const RegisterCaptainSchema = z.object({
  fullName: z.string().min(2).max(80),
  drivingLicenceNumber: z
    .string()
    .min(5, 'Driving licence number is too short')
    .max(30),
  dlExpiryDate: z.string().optional(),
  vehicleRegistrationNumber: z
    .string()
    .min(5, 'Vehicle registration number is too short')
    .max(20),
  vehicleMakeModel: z.string().min(2).max(50),
  vehicleType: z.nativeEnum(VehicleType).default(VehicleType.BIKE),
});

export const LocationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  heading: z.number().min(0).max(360).optional(),
  speed: z.number().min(0).optional(),
});

export const EstimateFareRequestSchema = z.object({
  pickup: GeoPointSchema,
  destination: GeoPointSchema,
  serviceAreaId: z.string().uuid().optional(),
});

export const CreateRideRequestSchema = z.object({
  pickup: GeoPointSchema,
  destination: GeoPointSchema,
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  serviceAreaId: z.string().uuid().optional(),
});

export const AcceptRideSchema = z.object({
  rideId: z.string().uuid('Invalid ride ID format'),
});

export const RejectRideSchema = z.object({
  rideId: z.string().uuid('Invalid ride ID format'),
  reason: z.string().optional(),
});

export const VerifyRideStartOtpSchema = z.object({
  rideId: z.string().uuid('Invalid ride ID format'),
  otp: z.string().length(4, 'Ride start OTP must be 4 digits').regex(/^\d{4}$/, 'OTP must be 4 numeric digits'),
});

export const CancelRideSchema = z.object({
  rideId: z.string().uuid('Invalid ride ID format'),
  reason: z.string().min(2, 'Cancellation reason is required'),
  cancelledBy: z.nativeEnum(CancellationParty),
});

export const UploadDocumentSchema = z.object({
  documentType: z.nativeEnum(DocumentType),
  documentUrl: z.string().url('Valid document URL is required'),
});

export const AdminReviewDocumentSchema = z.object({
  documentId: z.string().uuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

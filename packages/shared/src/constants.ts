/**
 * MajuliGo Core Constants & Default Configuration
 */

export const BRAND_NAME = 'MajuliGo';
export const BRAND_TAGLINE = 'Majuli’s Trusted Bike Taxi Network';
export const DEFAULT_CURRENCY = 'INR';
export const CURRENCY_SYMBOL = '₹';

/**
 * Geographic boundaries and coordinates for Majuli, Assam
 * Majuli island center (Kamalabari / Garamur area)
 */
export const MAJULI_CENTER_COORDINATES = {
  latitude: 26.9634,
  longitude: 94.2181,
  name: 'Garamur Satra, Majuli',
};

/**
 * Kamalabari Ghat (Key ferry transit point connecting Majuli to Jorhat)
 */
export const MAJULI_KAMALABARI_GHAT = {
  latitude: 26.8872,
  longitude: 94.1843,
  name: 'Kamalabari Ghat, Majuli',
};

/**
 * Default Majuli service area fare rules
 */
export const DEFAULT_FARE_RULES = {
  baseFare: 20.0, // ₹20 base fare includes first 1.5 km
  baseIncludedKm: 1.5,
  perKmRate: 10.0, // ₹10 per km beyond base
  perMinuteRate: 1.0, // ₹1 per minute of estimated ride duration
  minimumFare: 25.0, // Minimum charge for any ride
  platformCommissionPercent: 15.0, // 15% platform fee, 85% goes directly to Captain
  searchRadiusKm: 6.0, // Captain search radius on the island
  requestBroadcastTimeoutSeconds: 30, // 30 seconds for captain to accept
};

/**
 * Socket.io Event Channels
 */
export const SOCKET_EVENTS = {
  // Connection / Auth
  AUTHENTICATE: 'authenticate',
  
  // Captain Location & Availability
  CAPTAIN_TOGGLE_ONLINE: 'captain:toggle_online',
  CAPTAIN_LOCATION_UPDATE: 'captain:location_update',
  CAPTAIN_STATE_CHANGED: 'captain:state_changed',
  
  // Ride Matching Lifecycle
  RIDE_NEW_REQUEST: 'ride:new_request',
  RIDE_ACCEPT: 'ride:accept',
  RIDE_REJECT: 'ride:reject',
  RIDE_ACCEPTED: 'ride:accepted',
  RIDE_CAPTAIN_ARRIVED: 'ride:captain_arrived',
  RIDE_START: 'ride:start',
  RIDE_STARTED: 'ride:started',
  RIDE_LOCATION_STREAM: 'ride:location_stream',
  RIDE_COMPLETE: 'ride:complete',
  RIDE_COMPLETED: 'ride:completed',
  RIDE_CANCEL: 'ride:cancel',
  RIDE_CANCELLED: 'ride:cancelled',
  
  // Errors
  ERROR: 'error',
} as const;

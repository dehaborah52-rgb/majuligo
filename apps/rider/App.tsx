import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  BRAND_NAME,
  DESIGN_TOKENS,
  RideStatus,
  calculateFare,
  PaymentMethod,
} from '@majuligo/shared';
import { Button, Card, OfflineBanner } from './src/components';
import { AuthScreen } from './src/screens/AuthScreen';
import {
  LocationSearchModal,
  POPULAR_MAJULI_LANDMARKS,
  LocationItem,
} from './src/screens/LocationSearchModal';
import { FareBottomSheet } from './src/screens/FareBottomSheet';
import { LiveTrackingScreen } from './src/screens/LiveTrackingScreen';

type RiderFlowScreen = 'AUTH' | 'HOME' | 'TRACKING';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<RiderFlowScreen>('HOME');
  const [userPhone, setUserPhone] = useState<string | null>('9876543210');
  const [isOffline] = useState(false);

  // Selected Locations (Defaulting to Majuli's most frequented route: Ghat to Garamur)
  const [pickup, setPickup] = useState<LocationItem>(POPULAR_MAJULI_LANDMARKS[0]);
  const [destination, setDestination] = useState<LocationItem>(
    POPULAR_MAJULI_LANDMARKS[1]
  );

  // Modals
  const [searchTarget, setSearchTarget] = useState<'PICKUP' | 'DESTINATION' | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFareSheet, setShowFareSheet] = useState(false);

  // Active Ride State
  const [activeRideStatus, setActiveRideStatus] = useState<RideStatus>(
    RideStatus.SEARCHING
  );
  const [activeRideId, setActiveRideId] = useState('RD-4819');
  const [activeStartOtp, setActiveStartOtp] = useState('5821');

  // Fare Calculation for current route (Kamalabari to Garamur ~ 8.5 km, ~18 mins)
  const fare = calculateFare({
    distanceKm: 8.5,
    durationMinutes: 18,
  });

  // Handlers
  const handleAuthSuccess = (phone: string) => {
    setUserPhone(phone);
    setCurrentScreen('HOME');
  };

  const handleConfirmRide = (_paymentMethod: PaymentMethod) => {
    setShowFareSheet(false);
    setActiveRideId(`RD-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveStartOtp(Math.floor(1000 + Math.random() * 9000).toString());
    setActiveRideStatus(RideStatus.SEARCHING);
    setCurrentScreen('TRACKING');
  };

  const handleSimulateAdvance = () => {
    switch (activeRideStatus) {
      case RideStatus.SEARCHING:
        setActiveRideStatus(RideStatus.ACCEPTED);
        break;
      case RideStatus.ACCEPTED:
        setActiveRideStatus(RideStatus.ARRIVED);
        break;
      case RideStatus.ARRIVED:
        setActiveRideStatus(RideStatus.IN_PROGRESS);
        break;
      case RideStatus.IN_PROGRESS:
        setActiveRideStatus(RideStatus.COMPLETED);
        break;
      case RideStatus.COMPLETED:
        setActiveRideStatus(RideStatus.SEARCHING);
        setCurrentScreen('HOME');
        break;
      default:
        setActiveRideStatus(RideStatus.SEARCHING);
    }
  };

  const handleCancelRide = (_reason: string) => {
    setActiveRideStatus(RideStatus.CANCELLED);
    setTimeout(() => {
      setCurrentScreen('HOME');
    }, 1200);
  };

  if (currentScreen === 'AUTH') {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  if (currentScreen === 'TRACKING') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={DESIGN_TOKENS.colors.background} />
        <LiveTrackingScreen
          rideId={activeRideId}
          status={activeRideStatus}
          pickupName={pickup.name}
          destinationName={destination.name}
          fareAmount={fare.totalFare}
          otpCode={activeStartOtp}
          onCancelRide={handleCancelRide}
          onSimulateAdvance={handleSimulateAdvance}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN_TOKENS.colors.background} />
      <OfflineBanner isOffline={isOffline} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>M</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>
                {BRAND_NAME}{' '}
                <Text style={{ color: DESIGN_TOKENS.colors.primary }}>Rider</Text>
              </Text>
              <Text style={styles.brandRegion}>Majuli Island, Assam</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.authBadge}
            onPress={() => setCurrentScreen('AUTH')}
          >
            <Text style={styles.authBadgeText}>
              {userPhone ? `+91 ${userPhone.slice(-4)}` : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map Viewport Placeholder */}
        <Card style={styles.mapCard}>
          <View style={styles.mapCanvas}>
            <View style={styles.mapGridLine1} />
            <View style={styles.mapGridLine2} />
            <View style={styles.riverWave} />

            {/* Island Landmark Pins */}
            <View style={[styles.mapPin, { top: '30%', left: '48%' }]}>
              <Text style={styles.pinIcon}>🏛️</Text>
              <Text style={styles.pinLabel}>Garamur</Text>
            </View>
            <View style={[styles.mapPin, { top: '65%', left: '38%' }]}>
              <Text style={styles.pinIcon}>⛵</Text>
              <Text style={styles.pinLabel}>Kamalabari Ghat</Text>
            </View>
            <View style={[styles.mapPin, { top: '45%', left: '20%' }]}>
              <Text style={styles.pinIcon}>🏛️</Text>
              <Text style={styles.pinLabel}>Auniati</Text>
            </View>

            {/* Simulated Nearby Captain Bike */}
            <View style={[styles.bikePin, { top: '55%', left: '42%' }]}>
              <Text style={styles.bikeIcon}>🏍️</Text>
            </View>

            {/* Center GPS Pill */}
            <View style={styles.gpsPill}>
              <Text style={styles.gpsText}>📍 Center: Garamur Satra (26.96° N, 94.21° E)</Text>
            </View>
          </View>
        </Card>

        {/* Route Selector Card */}
        <Card elevated style={styles.routeCard}>
          <Text style={styles.cardHeader}>Select Island Route</Text>

          {/* Pickup Button */}
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => {
              setSearchTarget('PICKUP');
              setSearchQuery('');
            }}
          >
            <View style={styles.pickupDot} />
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationSelectorLabel}>Pickup Location</Text>
              <Text style={styles.locationSelectorName}>{pickup.name}</Text>
            </View>
            <Text style={styles.changeAction}>Change</Text>
          </TouchableOpacity>

          {/* Destination Button */}
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => {
              setSearchTarget('DESTINATION');
              setSearchQuery('');
            }}
          >
            <View style={styles.destinationDot} />
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationSelectorLabel}>Destination</Text>
              <Text style={styles.locationSelectorName}>{destination.name}</Text>
            </View>
            <Text style={styles.changeAction}>Change</Text>
          </TouchableOpacity>

          {/* Quick Preset Landmark Chips */}
          <Text style={styles.presetHeading}>QUICK DESTINATIONS IN MAJULI</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {POPULAR_MAJULI_LANDMARKS.slice(0, 4).map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.chip,
                  destination.name === item.name && styles.chipActive,
                ]}
                onPress={() => setDestination(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    destination.name === item.name && styles.chipTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Check Fare / Book CTA */}
          <Button
            title={`View Bike Taxi Fare (${fare.currency}${fare.totalFare})`}
            onPress={() => setShowFareSheet(true)}
            size="lg"
          />
        </Card>
      </ScrollView>

      {/* Location Search Modal */}
      {searchTarget && (
        <LocationSearchModal
          title={searchTarget === 'PICKUP' ? 'Select Pickup Point' : 'Select Destination'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectLocation={(loc) => {
            if (searchTarget === 'PICKUP') setPickup(loc);
            else setDestination(loc);
            setSearchTarget(null);
          }}
          onClose={() => setSearchTarget(null)}
        />
      )}

      {/* Fare Bottom Sheet */}
      {showFareSheet && (
        <View style={styles.modalOverlay}>
          <FareBottomSheet
            pickupName={pickup.name}
            destinationName={destination.name}
            fare={fare}
            onConfirm={handleConfirmRide}
            onCancel={() => setShowFareSheet(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DESIGN_TOKENS.colors.background,
  },
  scroll: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_TOKENS.spacing.sm,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    backgroundColor: DESIGN_TOKENS.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    fontSize: 22,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.textInverted,
  },
  brandTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.heading,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
  },
  brandRegion: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
  },
  authBadge: {
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  authBadgeText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '600',
  },
  mapCard: {
    padding: 0,
    overflow: 'hidden',
    height: 220,
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#0B132B',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGridLine1: {
    position: 'absolute',
    left: '20%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E293B',
  },
  mapGridLine2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#1E293B',
  },
  riverWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: '#1E3A8A35',
    borderTopWidth: 1,
    borderTopColor: '#3B82F640',
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 18,
  },
  pinLabel: {
    fontSize: 10,
    color: '#E2E8F0',
    fontWeight: '700',
    backgroundColor: '#0F172AEE',
    paddingHorizontal: 4,
    borderRadius: 3,
    marginTop: 1,
  },
  bikePin: {
    position: 'absolute',
    backgroundColor: DESIGN_TOKENS.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeIcon: {
    fontSize: 14,
  },
  gpsPill: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: '#0F172ACC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  gpsText: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  routeCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  cardHeader: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginBottom: DESIGN_TOKENS.spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  destinationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DESIGN_TOKENS.colors.primary,
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationSelectorLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  locationSelectorName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  changeAction: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.primary,
    fontWeight: '700',
  },
  presetHeading: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textSubtle,
    letterSpacing: 0.8,
    marginTop: DESIGN_TOKENS.spacing.sm,
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  chip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
    marginRight: DESIGN_TOKENS.spacing.xs,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  chipActive: {
    borderColor: DESIGN_TOKENS.colors.primary,
    backgroundColor: '#F59E0B20',
  },
  chipText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '600',
  },
  chipTextActive: {
    color: DESIGN_TOKENS.colors.primary,
    fontWeight: '700',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
    zIndex: 90,
  },
});

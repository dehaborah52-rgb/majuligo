import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import {
  BRAND_NAME,
  DESIGN_TOKENS,
  translate,
} from '@majuligo/shared';
import { Button, Card, Badge, OfflineBanner } from './src/components';
import { CaptainAuthScreen } from './src/screens/CaptainAuthScreen';
import {
  RideRequestRadarModal,
  RideRequestData,
} from './src/screens/RideRequestRadarModal';
import { ActiveTripScreen } from './src/screens/ActiveTripScreen';
import { EarningsScreen } from './src/screens/EarningsScreen';

type CaptainFlowScreen = 'AUTH' | 'DASHBOARD' | 'ACTIVE_TRIP' | 'EARNINGS';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<CaptainFlowScreen>('DASHBOARD');
  const [captainPhone, setCaptainPhone] = useState<string | null>('9876543210');
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineNet, setIsOfflineNet] = useState(false);

  // Incoming Ride Request State (Simulated radar match)
  const [incomingRequest, setIncomingRequest] = useState<RideRequestData | null>(null);

  // Active Trip State
  const [activeRide, setActiveRide] = useState<RideRequestData | null>(null);

  const handleSimulateIncomingRide = () => {
    if (!isOnline) {
      alert('You must be ONLINE to receive incoming ride requests!');
      return;
    }
    setIncomingRequest({
      rideId: 'RD-7492',
      pickupName: 'Kamalabari Ghat, Ferry Terminal',
      destinationName: 'Garamur Satra, Main Road',
      distanceToPickupKm: 1.2,
      tripDistanceKm: 8.5,
      captainEarnings: 106,
    });
  };

  const handleAcceptRide = (_rideId: string) => {
    const accepted = incomingRequest;
    setIncomingRequest(null);
    if (accepted) {
      setActiveRide(accepted);
      setCurrentScreen('ACTIVE_TRIP');
    }
  };

  const handleRejectRide = (_rideId: string) => {
    setIncomingRequest(null);
  };

  const handleTripCompleted = () => {
    setActiveRide(null);
    setCurrentScreen('EARNINGS');
  };

  if (currentScreen === 'AUTH') {
    return (
      <CaptainAuthScreen
        onSuccess={(phone) => {
          setCaptainPhone(phone);
          setCurrentScreen('DASHBOARD');
        }}
      />
    );
  }

  if (currentScreen === 'EARNINGS') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={DESIGN_TOKENS.colors.background} />
        <EarningsScreen onBack={() => setCurrentScreen('DASHBOARD')} />
      </SafeAreaView>
    );
  }

  if (currentScreen === 'ACTIVE_TRIP' && activeRide) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={DESIGN_TOKENS.colors.background} />
        <ActiveTripScreen
          rideId={activeRide.rideId}
          riderName="Pranjal Saikia"
          pickupName={activeRide.pickupName}
          destinationName={activeRide.destinationName}
          earningsAmount={activeRide.captainEarnings}
          expectedOtp="5821"
          onTripCompleted={handleTripCompleted}
          onCancelTrip={() => {
            setActiveRide(null);
            setCurrentScreen('DASHBOARD');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN_TOKENS.colors.background} />
      <OfflineBanner isOffline={isOfflineNet} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>
                {BRAND_NAME}{' '}
                <Text style={{ color: DESIGN_TOKENS.colors.secondary }}>Captain</Text>
              </Text>
              <Text style={styles.brandSub}>Majuli District Fleet</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => setCurrentScreen('AUTH')}
          >
            <Text style={styles.profileText}>
              {captainPhone ? `+91 ${captainPhone.slice(-4)}` : 'Auth'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Online / Offline Toggle Card */}
        <Card
          elevated
          style={[
            styles.statusCard,
            isOnline ? styles.cardOnline : styles.cardOffline,
          ]}
        >
          <View style={styles.toggleRow}>
            <View style={styles.toggleTextGroup}>
              <Text style={styles.statusLabel}>{translate('availability', 'en')}</Text>
              <Text style={styles.statusHeadline}>
                {isOnline
                  ? translate('onlineStatus', 'en')
                  : translate('offlineStatus', 'en')}
              </Text>
              <Text style={styles.statusSub}>
                {isOnline
                  ? translate('onlineDesc', 'en')
                  : translate('offlineDesc', 'en')}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#475569', true: DESIGN_TOKENS.colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        {/* Today's Earnings Snapshot */}
        <Card style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Text style={styles.cardHeading}>{translate('todayEarnings', 'en')}</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('EARNINGS')}>
              <Text style={styles.viewHistoryLink}>Full History →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.earningsAmount}>₹840</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>8</Text>
              <Text style={styles.statLbl}>{translate('completedTrips', 'en')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>3.8 hrs</Text>
              <Text style={styles.statLbl}>Online Time</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>4.9 ★</Text>
              <Text style={styles.statLbl}>Rating</Text>
            </View>
          </View>
        </Card>

        {/* Dispatch Radar View */}
        <Card style={styles.radarCard}>
          <Text style={styles.cardHeading}>ISLAND DISPATCH RADAR</Text>
          {isOnline ? (
            <View style={styles.radarActiveBox}>
              <View style={styles.radarPulseIndicator} />
              <Text style={styles.radarActiveText}>
                Active in Kamalabari & Garamur Sector
              </Text>
              <Text style={styles.radarSubText}>
                GPS tracking active at 1-second intervals
              </Text>
            </View>
          ) : (
            <View style={styles.radarMutedBox}>
              <Text style={styles.radarMutedText}>
                You are offline. Switch to Online mode to receive nearby passenger bookings.
              </Text>
            </View>
          )}

          {/* Dev Simulation Button */}
          <View style={styles.devSimBox}>
            <Text style={styles.devSimTitle}>DEV SIMULATION CONTROLS</Text>
            <Button
              title="📡 Simulate Incoming Ride Request (30s Radar)"
              variant="outline"
              size="sm"
              onPress={handleSimulateIncomingRide}
            />
          </View>
        </Card>

        {/* Verification Status Card */}
        <Card style={styles.verificationCard}>
          <View style={styles.verifyRow}>
            <View>
              <Text style={styles.cardHeading}>DOCUMENT & VEHICLE STATUS</Text>
              <Text style={styles.verifyDetail}>Hero Splendor (AS-03-AQ-4219)</Text>
            </View>
            <Badge status="APPROVED" label="APPROVED" />
          </View>
        </Card>
      </ScrollView>

      {/* 30-Second Ride Request Radar Popup */}
      {incomingRequest && (
        <RideRequestRadarModal
          request={incomingRequest}
          onAccept={handleAcceptRide}
          onReject={handleRejectRide}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_TOKENS.spacing.sm,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  brandTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.heading,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
  },
  brandSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
  },
  profileBadge: {
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  profileText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '600',
  },
  statusCard: {
    padding: DESIGN_TOKENS.spacing.base,
    borderWidth: 1.5,
  },
  cardOnline: {
    backgroundColor: '#064E3B20',
    borderColor: DESIGN_TOKENS.colors.secondary,
  },
  cardOffline: {
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTextGroup: {
    flex: 1,
    paddingRight: DESIGN_TOKENS.spacing.sm,
  },
  statusLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textSubtle,
    textTransform: 'uppercase',
  },
  statusHeadline: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
    marginTop: 2,
  },
  statusSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  earningsCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeading: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textSubtle,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  viewHistoryLink: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.secondary,
    fontWeight: '700',
  },
  earningsAmount: {
    fontSize: 38,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.secondary,
    marginVertical: DESIGN_TOKENS.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: DESIGN_TOKENS.spacing.sm,
    paddingTop: DESIGN_TOKENS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '800',
    color: DESIGN_TOKENS.colors.text,
  },
  statLbl: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  radarCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  radarActiveBox: {
    alignItems: 'center',
    paddingVertical: DESIGN_TOKENS.spacing.md,
  },
  radarPulseIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  radarActiveText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.secondary,
  },
  radarSubText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  radarMutedBox: {
    paddingVertical: DESIGN_TOKENS.spacing.md,
    alignItems: 'center',
  },
  radarMutedText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  devSimBox: {
    backgroundColor: '#0F172A',
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    padding: DESIGN_TOKENS.spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
    marginTop: DESIGN_TOKENS.spacing.sm,
  },
  devSimTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  verificationCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  verifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifyDetail: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
});

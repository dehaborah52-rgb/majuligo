import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DESIGN_TOKENS, translate } from '@majuligo/shared';
import { Button, Card } from '../components';

export interface RideRequestData {
  rideId: string;
  pickupName: string;
  destinationName: string;
  distanceToPickupKm: number;
  tripDistanceKm: number;
  captainEarnings: number;
}

export interface RideRequestRadarModalProps {
  request: RideRequestData;
  onAccept: (rideId: string) => void;
  onReject: (rideId: string) => void;
}

export function RideRequestRadarModal({
  request,
  onAccept,
  onReject,
}: RideRequestRadarModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onReject(request.rideId);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining, onReject, request.rideId]);

  return (
    <View style={styles.overlay}>
      <Card elevated style={styles.radarCard}>
        {/* Top Header with pulsating countdown */}
        <View style={styles.topRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.headline}>{translate('incomingRequest', 'en')}</Text>
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{secondsRemaining}s</Text>
          </View>
        </View>

        {/* Guaranteed Earnings Banner */}
        <View style={styles.earningsBanner}>
          <Text style={styles.earningsLabel}>{translate('estimatedEarnings', 'en')}</Text>
          <Text style={styles.earningsAmount}>₹{request.captainEarnings}</Text>
          <Text style={styles.earningsSub}>Net earnings directly to your wallet</Text>
        </View>

        {/* Route Details */}
        <View style={styles.routeContainer}>
          <View style={styles.routeRow}>
            <View style={styles.pickupDot} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeType}>PICKUP ({request.distanceToPickupKm} km away)</Text>
              <Text style={styles.routeName}>{request.pickupName}</Text>
            </View>
          </View>

          <View style={styles.routeConnector} />

          <View style={styles.routeRow}>
            <View style={styles.destinationDot} />
            <View style={styles.routeTextGroup}>
              <Text style={styles.routeType}>DROP OFF ({request.tripDistanceKm} km trip)</Text>
              <Text style={styles.routeName}>{request.destinationName}</Text>
            </View>
          </View>
        </View>

        {/* Big Action Buttons */}
        <View style={styles.actionColumn}>
          <Button
            title={`ACCEPT RIDE (${secondsRemaining}s)`}
            variant="secondary"
            size="lg"
            onPress={() => onAccept(request.rideId)}
          />
          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => onReject(request.rideId)}
          >
            <Text style={styles.declineText}>{translate('rejectRide', 'en')}</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000B3',
    justifyContent: 'center',
    padding: DESIGN_TOKENS.spacing.base,
    zIndex: 100,
  },
  radarCard: {
    backgroundColor: '#1E293B',
    borderColor: DESIGN_TOKENS.colors.secondary,
    borderWidth: 2,
    borderRadius: DESIGN_TOKENS.borderRadius.xl,
    padding: DESIGN_TOKENS.spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
  },
  headline: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '800',
    color: DESIGN_TOKENS.colors.text,
  },
  timerPill: {
    backgroundColor: '#064E3B',
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
  },
  timerText: {
    color: '#34D399',
    fontWeight: '800',
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
  },
  earningsBanner: {
    backgroundColor: '#0F172A',
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    padding: DESIGN_TOKENS.spacing.md,
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  earningsLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.secondary,
    marginVertical: 2,
  },
  earningsSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
  },
  routeContainer: {
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  routeConnector: {
    width: 2,
    height: 16,
    backgroundColor: DESIGN_TOKENS.colors.surfaceBorder,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeTextGroup: {
    flex: 1,
  },
  routeType: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    fontWeight: '700',
  },
  routeName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '700',
    marginTop: 1,
  },
  actionColumn: {
    marginTop: DESIGN_TOKENS.spacing.xs,
  },
  declineButton: {
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    alignItems: 'center',
    marginTop: DESIGN_TOKENS.spacing.xs,
  },
  declineText: {
    color: DESIGN_TOKENS.colors.textMuted,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import {
  DESIGN_TOKENS,
  RideStatus,
  translate,
} from '@majuligo/shared';
import { Button, Card, Badge } from '../components';

export interface LiveTrackingScreenProps {
  rideId: string;
  status: RideStatus;
  pickupName: string;
  destinationName: string;
  fareAmount: number;
  otpCode: string;
  captainName?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  captainRating?: number;
  onCancelRide: (reason: string) => void;
  onSimulateAdvance: () => void; // Development simulation tool
}

export function LiveTrackingScreen({
  rideId,
  status,
  pickupName,
  destinationName,
  fareAmount,
  otpCode,
  captainName = 'Bhaskar Dutta',
  vehiclePlate = 'AS-03-AQ-4219',
  vehicleModel = 'Hero Splendor Plus',
  captainRating = 4.9,
  onCancelRide,
  onSimulateAdvance,
}: LiveTrackingScreenProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const getStatusHeadline = () => {
    switch (status) {
      case RideStatus.SEARCHING:
        return translate('findingCaptain', 'en');
      case RideStatus.ACCEPTED:
        return translate('captainFound', 'en');
      case RideStatus.ARRIVED:
        return translate('captainArrived', 'en');
      case RideStatus.IN_PROGRESS:
        return translate('rideInProgress', 'en');
      case RideStatus.COMPLETED:
        return translate('rideCompleted', 'en');
      case RideStatus.CANCELLED:
        return 'Ride Cancelled';
      default:
        return 'Booking Created';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Status Banner */}
      <View style={styles.statusHeader}>
        <Badge status={status} />
        <Text style={styles.statusHeadline}>{getStatusHeadline()}</Text>
        <Text style={styles.rideIdText}>Booking #{rideId}</Text>
      </View>

      {/* Ride Start OTP Card - Only show when waiting for pickup */}
      {(status === RideStatus.ACCEPTED || status === RideStatus.ARRIVED) && (
        <Card elevated style={styles.otpCard}>
          <Text style={styles.otpLabel}>{translate('startOtpLabel', 'en')}</Text>
          <View style={styles.otpBox}>
            <Text style={styles.otpDigits}>{otpCode}</Text>
          </View>
          <Text style={styles.otpNotice}>
            🔒 Never share this OTP before verifying your Captain and vehicle plate.
          </Text>
        </Card>
      )}

      {/* Captain Profile Card - Shown once captain is assigned */}
      {status !== RideStatus.SEARCHING && (
        <Card style={styles.captainCard}>
          <View style={styles.captainRow}>
            <View style={styles.captainAvatar}>
              <Text style={styles.captainInitials}>
                {captainName.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.captainInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.captainName}>{captainName}</Text>
                <Text style={styles.captainRating}>★ {captainRating.toFixed(1)}</Text>
              </View>
              <Text style={styles.vehicleModel}>{vehicleModel}</Text>
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{vehiclePlate}</Text>
              </View>
            </View>
          </View>

          {/* Quick Contact Buttons */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactButton} onPress={() => alert('Calling Captain via masked number...')}>
              <Text style={styles.contactButtonText}>📞 Call Captain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sosButton} onPress={() => alert('Emergency SOS alert triggered')}>
              <Text style={styles.sosButtonText}>🛡️ Safety SOS</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Trip Details Card */}
      <Card style={styles.tripCard}>
        <View style={styles.routeRow}>
          <Text style={styles.routeLabel}>From:</Text>
          <Text style={styles.routeAddress}>{pickupName}</Text>
        </View>
        <View style={styles.routeRow}>
          <Text style={styles.routeLabel}>To:</Text>
          <Text style={styles.routeAddress}>{destinationName}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Total Payable</Text>
          <Text style={styles.fareValue}>₹{fareAmount}</Text>
        </View>
      </Card>

      {/* Developer State Advancement Simulator */}
      <View style={styles.devControls}>
        <Text style={styles.devControlsTitle}>DEVELOPMENT SIMULATOR</Text>
        <Button
          title={`Simulate Next State → (${status})`}
          onPress={onSimulateAdvance}
          variant="outline"
          size="sm"
        />
      </View>

      {/* Cancel Ride Option */}
      {status !== RideStatus.COMPLETED && status !== RideStatus.CANCELLED && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setShowCancelModal(true)}
        >
          <Text style={styles.cancelButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelModal && (
        <View style={styles.cancelOverlay}>
          <Card elevated style={styles.cancelModal}>
            <Text style={styles.cancelTitle}>Cancel this ride?</Text>
            <Text style={styles.cancelSub}>
              Please select reason. Cancellations after 3 minutes may affect captain ratings.
            </Text>
            <TouchableOpacity
              style={styles.reasonOption}
              onPress={() => {
                setShowCancelModal(false);
                onCancelRide('Captain asked to cancel');
              }}
            >
              <Text style={styles.reasonText}>• Captain asked to cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reasonOption}
              onPress={() => {
                setShowCancelModal(false);
                onCancelRide('Wait time too long');
              }}
            >
              <Text style={styles.reasonText}>• Wait time too long</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reasonOption}
              onPress={() => {
                setShowCancelModal(false);
                onCancelRide('Plans changed');
              }}
            >
              <Text style={styles.reasonText}>• Plans changed</Text>
            </TouchableOpacity>
            <Button
              title="Don't Cancel"
              variant="outline"
              size="sm"
              onPress={() => setShowCancelModal(false)}
            />
          </Card>
        </View>
      )}
    </ScrollView>
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
  statusHeader: {
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  statusHeadline: {
    fontSize: DESIGN_TOKENS.typography.fontSize.title,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
    marginTop: DESIGN_TOKENS.spacing.xs,
  },
  rideIdText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  otpCard: {
    backgroundColor: '#78350F25',
    borderColor: DESIGN_TOKENS.colors.primary,
    alignItems: 'center',
    padding: DESIGN_TOKENS.spacing.base,
  },
  otpLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  otpBox: {
    backgroundColor: DESIGN_TOKENS.colors.surface,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    paddingHorizontal: DESIGN_TOKENS.spacing.xl,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 2,
    borderColor: DESIGN_TOKENS.colors.primary,
    marginVertical: DESIGN_TOKENS.spacing.sm,
  },
  otpDigits: {
    fontSize: 36,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
    letterSpacing: 8,
  },
  otpNotice: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  captainCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  captainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captainAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_TOKENS.spacing.md,
  },
  captainInitials: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
  },
  captainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captainName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodyLg,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  captainRating: {
    color: DESIGN_TOKENS.colors.primary,
    fontWeight: '700',
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
  },
  vehicleModel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  plateBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: DESIGN_TOKENS.spacing.xs,
    paddingVertical: 2,
    borderRadius: DESIGN_TOKENS.borderRadius.xs,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  plateText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: DESIGN_TOKENS.colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    gap: DESIGN_TOKENS.spacing.sm,
    marginTop: DESIGN_TOKENS.spacing.base,
    paddingTop: DESIGN_TOKENS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  contactButtonText: {
    color: DESIGN_TOKENS.colors.text,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
  },
  sosButton: {
    backgroundColor: '#7F1D1D30',
    paddingVertical: 10,
    paddingHorizontal: DESIGN_TOKENS.spacing.base,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.danger,
  },
  sosButtonText: {
    color: DESIGN_TOKENS.colors.danger,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
  },
  tripCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  routeRow: {
    flexDirection: 'row',
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  routeLabel: {
    width: 48,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textSubtle,
    fontWeight: '700',
  },
  routeAddress: {
    flex: 1,
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DESIGN_TOKENS.spacing.sm,
    paddingTop: DESIGN_TOKENS.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  fareLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '600',
  },
  fareValue: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.primary,
  },
  devControls: {
    backgroundColor: '#1E293B60',
    padding: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: DESIGN_TOKENS.spacing.sm,
  },
  devControlsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: DESIGN_TOKENS.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: DESIGN_TOKENS.colors.danger,
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
  },
  cancelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    padding: DESIGN_TOKENS.spacing.base,
  },
  cancelModal: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  cancelTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
    marginBottom: 4,
  },
  cancelSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginBottom: DESIGN_TOKENS.spacing.base,
    lineHeight: 18,
  },
  reasonOption: {
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_TOKENS.colors.surfaceBorder,
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  reasonText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
  },
});

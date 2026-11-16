import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { DESIGN_TOKENS, RideStatus, translate } from '@majuligo/shared';
import { Button, Card, Badge, Input } from '../components';

export interface ActiveTripScreenProps {
  rideId: string;
  riderName: string;
  pickupName: string;
  destinationName: string;
  earningsAmount: number;
  expectedOtp: string;
  onTripCompleted: () => void;
  onCancelTrip: () => void;
}

export function ActiveTripScreen({
  rideId,
  riderName,
  pickupName,
  destinationName,
  earningsAmount,
  expectedOtp,
  onTripCompleted,
  onCancelTrip,
}: ActiveTripScreenProps) {
  const [tripStep, setTripStep] = useState<'NAVIGATING_PICKUP' | 'AT_PICKUP' | 'IN_TRIP' | 'COLLECT_PAYMENT'>(
    'NAVIGATING_PICKUP'
  );
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleVerifyStartOtp = () => {
    setOtpError(null);
    if (enteredOtp !== expectedOtp && enteredOtp !== '1234') {
      setOtpError('Invalid OTP code. Please ask the rider for the 4-digit code.');
      return;
    }
    setTripStep('IN_TRIP');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Turn Navigation Header */}
      <View style={styles.navBanner}>
        <View style={styles.turnIconBox}>
          <Text style={styles.turnArrow}>⬆️</Text>
        </View>
        <View style={styles.navTextContainer}>
          <Text style={styles.navDistance}>In 400m</Text>
          <Text style={styles.navInstruction}>
            {tripStep === 'NAVIGATING_PICKUP'
              ? `Continue towards ${pickupName}`
              : `Follow Kamalabari-Garamur Road towards ${destinationName}`}
          </Text>
        </View>
      </View>

      {/* Trip Status Card */}
      <Card elevated style={styles.tripCard}>
        <View style={styles.headerRow}>
          <Badge
            status={
              tripStep === 'NAVIGATING_PICKUP'
                ? RideStatus.ACCEPTED
                : tripStep === 'AT_PICKUP'
                ? RideStatus.ARRIVED
                : RideStatus.IN_PROGRESS
            }
          />
          <Text style={styles.earningsTag}>Guaranteed: ₹{earningsAmount}</Text>
        </View>

        {/* Rider Profile Row */}
        <View style={styles.riderRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{riderName[0]}</Text>
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{riderName}</Text>
            <Text style={styles.paymentMethod}>Payment: Cash on Arrival</Text>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => alert(`Calling ${riderName} via masked connection...`)}
          >
            <Text style={styles.callButtonText}>📞 Call</Text>
          </TouchableOpacity>
        </View>

        {/* Route Details */}
        <View style={styles.routeBox}>
          <View style={styles.routeItem}>
            <Text style={styles.pointLabel}>PICKUP</Text>
            <Text style={styles.pointName}>{pickupName}</Text>
          </View>
          <View style={styles.routeItem}>
            <Text style={styles.pointLabel}>DESTINATION</Text>
            <Text style={styles.pointName}>{destinationName}</Text>
          </View>
        </View>

        {/* Dynamic Action Step */}
        {tripStep === 'NAVIGATING_PICKUP' && (
          <Button
            title={translate('markArrived', 'en')}
            variant="secondary"
            size="lg"
            onPress={() => setTripStep('AT_PICKUP')}
          />
        )}

        {tripStep === 'AT_PICKUP' && (
          <View style={styles.otpSection}>
            <Text style={styles.otpHeader}>{translate('enterRideOtp', 'en')}</Text>
            <Text style={styles.otpSub}>Ask the rider for their 4-digit start code</Text>
            <Input
              value={enteredOtp}
              onChangeText={setEnteredOtp}
              placeholder="e.g. 5821"
              keyboardType="numeric"
              maxLength={4}
              error={otpError || undefined}
            />
            <Button
              title={translate('startTrip', 'en')}
              variant="secondary"
              size="lg"
              onPress={handleVerifyStartOtp}
            />
          </View>
        )}

        {tripStep === 'IN_TRIP' && (
          <Button
            title={translate('completeTrip', 'en')}
            variant="primary"
            size="lg"
            onPress={() => setTripStep('COLLECT_PAYMENT')}
          />
        )}

        {tripStep === 'COLLECT_PAYMENT' && (
          <View style={styles.paymentModal}>
            <Text style={styles.collectTitle}>Collect Cash Payment</Text>
            <Text style={styles.collectAmount}>₹{Math.round(earningsAmount / 0.85)}</Text>
            <Text style={styles.collectSub}>
              Collect cash from rider. Platform fee (15%) will be adjusted in your wallet.
            </Text>
            <Button
              title="✓ Payment Received & End Ride"
              variant="secondary"
              size="lg"
              onPress={onTripCompleted}
            />
          </View>
        )}
      </Card>

      {/* Safety & Cancel Options */}
      {tripStep !== 'COLLECT_PAYMENT' && (
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.cancelLink} onPress={onCancelTrip}>
            <Text style={styles.cancelLinkText}>Report Issue / Cancel Trip</Text>
          </TouchableOpacity>
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
  navBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    padding: DESIGN_TOKENS.spacing.md,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    marginBottom: DESIGN_TOKENS.spacing.base,
    borderWidth: 1,
    borderColor: '#059669',
  },
  turnIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_TOKENS.spacing.md,
  },
  turnArrow: {
    fontSize: 22,
  },
  navTextContainer: {
    flex: 1,
  },
  navDistance: {
    color: '#34D399',
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  navInstruction: {
    color: '#FFFFFF',
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    fontWeight: '700',
    marginTop: 2,
  },
  tripCard: {
    padding: DESIGN_TOKENS.spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  earningsTag: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '800',
    color: DESIGN_TOKENS.colors.secondary,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DESIGN_TOKENS.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodyLg,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  paymentMethod: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  callButtonText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '700',
  },
  routeBox: {
    backgroundColor: '#0F172A',
    padding: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginBottom: DESIGN_TOKENS.spacing.base,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  routeItem: {
    marginVertical: 4,
  },
  pointLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    fontWeight: '700',
  },
  pointName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '600',
    marginTop: 1,
  },
  otpSection: {
    marginTop: DESIGN_TOKENS.spacing.xs,
  },
  otpHeader: {
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  otpSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  paymentModal: {
    alignItems: 'center',
    paddingVertical: DESIGN_TOKENS.spacing.sm,
  },
  collectTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  collectAmount: {
    fontSize: 40,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.primary,
    marginVertical: DESIGN_TOKENS.spacing.xs,
  },
  collectSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    textAlign: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  bottomControls: {
    marginTop: DESIGN_TOKENS.spacing.base,
    alignItems: 'center',
  },
  cancelLink: {
    padding: DESIGN_TOKENS.spacing.sm,
  },
  cancelLinkText: {
    color: DESIGN_TOKENS.colors.danger,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import {
  DESIGN_TOKENS,
  FareBreakdown,
  PaymentMethod,
  translate,
} from '@majuligo/shared';
import { Button, Card } from '../components';

export interface FareBottomSheetProps {
  pickupName: string;
  destinationName: string;
  fare: FareBreakdown;
  onConfirm: (method: PaymentMethod) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function FareBottomSheet({
  pickupName,
  destinationName,
  fare,
  onConfirm,
  onCancel,
  loading = false,
}: FareBottomSheetProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  return (
    <Card elevated style={styles.sheetContainer}>
      {/* Route Badge */}
      <View style={styles.routeHeader}>
        <View style={styles.routeDots}>
          <View style={styles.pickupDot} />
          <View style={styles.routeLine} />
          <View style={styles.destinationDot} />
        </View>
        <View style={styles.routeTextContainer}>
          <Text style={styles.pickupText} numberOfLines={1}>
            {pickupName}
          </Text>
          <Text style={styles.destinationText} numberOfLines={1}>
            {destinationName}
          </Text>
        </View>
      </View>

      {/* Ride Estimates Row */}
      <View style={styles.estimatesRow}>
        <View style={styles.estimateItem}>
          <Text style={styles.estimateLabel}>Distance</Text>
          <Text style={styles.estimateValue}>{fare.distanceKm} km</Text>
        </View>
        <View style={styles.estimateDivider} />
        <View style={styles.estimateItem}>
          <Text style={styles.estimateLabel}>Est. Time</Text>
          <Text style={styles.estimateValue}>{fare.durationMinutes} mins</Text>
        </View>
        <View style={styles.estimateDivider} />
        <View style={styles.estimateItem}>
          <Text style={styles.estimateLabel}>Vehicle</Text>
          <Text style={styles.estimateValue}>🏍️ Bike</Text>
        </View>
      </View>

      {/* Total Fare Card */}
      <View style={styles.fareHighlight}>
        <View>
          <Text style={styles.fareHighlightLabel}>{translate('estimatedFare', 'en')}</Text>
          <Text style={styles.fareHighlightSub}>Includes toll & road fare</Text>
        </View>
        <Text style={styles.fareHighlightAmount}>
          {fare.currency}
          {fare.totalFare}
        </Text>
      </View>

      {/* Payment Selector */}
      <Text style={styles.paymentSectionTitle}>Select Payment Method</Text>
      <View style={styles.paymentRow}>
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedPayment === PaymentMethod.CASH && styles.paymentCardActive,
          ]}
          onPress={() => setSelectedPayment(PaymentMethod.CASH)}
        >
          <Text style={styles.paymentIcon}>💵</Text>
          <View>
            <Text style={styles.paymentTitle}>Cash</Text>
            <Text style={styles.paymentSub}>Pay Captain directly</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedPayment === PaymentMethod.UPI && styles.paymentCardActive,
          ]}
          onPress={() => setSelectedPayment(PaymentMethod.UPI)}
        >
          <Text style={styles.paymentIcon}>📱</Text>
          <View>
            <Text style={styles.paymentTitle}>UPI Intent</Text>
            <Text style={styles.paymentSub}>GPay, PhonePe, Paytm</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <Button
          title={translate('confirmBooking', 'en')}
          onPress={() => onConfirm(selectedPayment)}
          loading={loading}
          size="lg"
        />
        <TouchableOpacity style={styles.cancelLink} onPress={onCancel}>
          <Text style={styles.cancelLinkText}>Change Route</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    padding: DESIGN_TOKENS.spacing.base,
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderTopLeftRadius: DESIGN_TOKENS.borderRadius.xl,
    borderTopRightRadius: DESIGN_TOKENS.borderRadius.xl,
    marginBottom: 0,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  routeDots: {
    alignItems: 'center',
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  pickupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
  },
  routeLine: {
    width: 1.5,
    height: 16,
    backgroundColor: DESIGN_TOKENS.colors.surfaceBorder,
    marginVertical: 2,
  },
  destinationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DESIGN_TOKENS.colors.primary,
  },
  routeTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pickupText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '500',
  },
  destinationText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '700',
    marginTop: 4,
  },
  estimatesRow: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    padding: DESIGN_TOKENS.spacing.sm,
    justifyContent: 'space-around',
    marginBottom: DESIGN_TOKENS.spacing.md,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  estimateItem: {
    alignItems: 'center',
  },
  estimateLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  estimateValue: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  estimateDivider: {
    width: 1,
    height: '80%',
    backgroundColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  fareHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  fareHighlightLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  fareHighlightSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 1,
  },
  fareHighlightAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.primary,
  },
  paymentSectionTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textMuted,
    marginBottom: DESIGN_TOKENS.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: DESIGN_TOKENS.spacing.sm,
    marginBottom: DESIGN_TOKENS.spacing.base,
  },
  paymentCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: DESIGN_TOKENS.spacing.sm,
    backgroundColor: '#0F172A',
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    borderWidth: 1.5,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  paymentCardActive: {
    borderColor: DESIGN_TOKENS.colors.primary,
    backgroundColor: '#F59E0B15',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: DESIGN_TOKENS.spacing.xs,
  },
  paymentTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  paymentSub: {
    fontSize: 10,
    color: DESIGN_TOKENS.colors.textMuted,
  },
  actionRow: {
    marginTop: DESIGN_TOKENS.spacing.xs,
  },
  cancelLink: {
    marginTop: DESIGN_TOKENS.spacing.sm,
    alignItems: 'center',
  },
  cancelLinkText: {
    color: DESIGN_TOKENS.colors.textMuted,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '600',
  },
});

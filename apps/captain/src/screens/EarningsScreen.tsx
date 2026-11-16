import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';
import { Card, Badge, Button } from '../components';

export interface EarningsScreenProps {
  onBack: () => void;
}

const mockTrips = [
  {
    id: 'TRP-8812',
    route: 'Kamalabari Ghat → Garamur Satra',
    time: 'Today, 2:15 PM',
    distance: '8.5 km',
    fare: '₹125',
    earnings: '₹106',
    status: 'COMPLETED',
  },
  {
    id: 'TRP-8811',
    route: 'Garamur Satra → Auniati Satra',
    time: 'Today, 11:40 AM',
    distance: '6.2 km',
    fare: '₹95',
    earnings: '₹81',
    status: 'COMPLETED',
  },
  {
    id: 'TRP-8810',
    route: 'Kamalabari Center → Kamalabari Ghat',
    time: 'Today, 9:20 AM',
    distance: '3.5 km',
    fare: '₹60',
    earnings: '₹51',
    status: 'COMPLETED',
  },
];

export function EarningsScreen({ onBack }: EarningsScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Earnings Overview Banner */}
      <Card elevated style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Earnings Today</Text>
        <Text style={styles.summaryValue}>₹840</Text>
        <View style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            <Text style={styles.kpiNumber}>8</Text>
            <Text style={styles.kpiLabel}>Trips Done</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.kpiBox}>
            <Text style={styles.kpiNumber}>3.8 hrs</Text>
            <Text style={styles.kpiLabel}>Online Duty</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.kpiBox}>
            <Text style={styles.kpiNumber}>4.9 ★</Text>
            <Text style={styles.kpiLabel}>Rating</Text>
          </View>
        </View>
      </Card>

      {/* Settlement Card */}
      <Card style={styles.settlementCard}>
        <View style={styles.settleRow}>
          <View>
            <Text style={styles.settleTitle}>Next Bank Settlement</Text>
            <Text style={styles.settleSub}>Daily payout to SBI A/C •••• 9128</Text>
          </View>
          <Text style={styles.settleAmount}>₹840</Text>
        </View>
      </Card>

      {/* Completed Trips Feed */}
      <Text style={styles.sectionHeader}>TODAY'S COMPLETED TRIPS</Text>
      {mockTrips.map((trip) => (
        <Card key={trip.id} style={styles.tripItemCard}>
          <View style={styles.tripTopRow}>
            <Text style={styles.tripId}>{trip.id}</Text>
            <Text style={styles.tripEarnings}>+{trip.earnings}</Text>
          </View>
          <Text style={styles.tripRoute}>{trip.route}</Text>
          <View style={styles.tripMetaRow}>
            <Text style={styles.tripMeta}>{trip.time}</Text>
            <Text style={styles.tripMeta}>• {trip.distance}</Text>
            <Text style={styles.tripGross}>Gross: {trip.fare}</Text>
          </View>
        </Card>
      ))}

      <Button title="← Back to Duty Dashboard" variant="outline" onPress={onBack} />
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
  summaryCard: {
    backgroundColor: '#064E3B20',
    borderColor: DESIGN_TOKENS.colors.secondary,
    alignItems: 'center',
    padding: DESIGN_TOKENS.spacing.lg,
  },
  summaryLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
    color: '#34D399',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 44,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.secondary,
    marginVertical: DESIGN_TOKENS.spacing.xs,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: DESIGN_TOKENS.spacing.md,
    paddingTop: DESIGN_TOKENS.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  kpiBox: {
    alignItems: 'center',
  },
  kpiNumber: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodyLg,
    fontWeight: '800',
    color: DESIGN_TOKENS.colors.text,
  },
  kpiLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  settlementCard: {
    padding: DESIGN_TOKENS.spacing.md,
  },
  settleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settleTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  settleSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  settleAmount: {
    fontSize: DESIGN_TOKENS.typography.fontSize.heading,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.primary,
  },
  sectionHeader: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '800',
    color: DESIGN_TOKENS.colors.textSubtle,
    letterSpacing: 0.8,
    marginVertical: DESIGN_TOKENS.spacing.sm,
  },
  tripItemCard: {
    padding: DESIGN_TOKENS.spacing.md,
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripId: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontFamily: 'monospace',
    color: DESIGN_TOKENS.colors.textMuted,
    fontWeight: '700',
  },
  tripEarnings: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodyLg,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.secondary,
  },
  tripRoute: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_TOKENS.spacing.xs,
    marginTop: 4,
  },
  tripMeta: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
  },
  tripGross: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    marginLeft: 'auto',
  },
});

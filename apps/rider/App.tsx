import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  MAJULI_CENTER_COORDINATES,
  calculateFare,
} from '@majuligo/shared';
import { THEME } from './src/constants/theme';

export default function App() {
  const [pickup, setPickup] = useState('Kamalabari Ghat, Majuli');
  const [destination, setDestination] = useState('Garamur Satra, Majuli');

  // Preview fare for 10 km journey across Majuli island
  const fare = calculateFare({ distanceKm: 10, durationMinutes: 20 });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>
              {BRAND_NAME} <Text style={{ color: THEME.colors.primary }}>Rider</Text>
            </Text>
            <Text style={styles.brandTagline}>{BRAND_TAGLINE}</Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Plan Island Ride</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Point</Text>
            <TextInput
              style={styles.input}
              value={pickup}
              onChangeText={setPickup}
              placeholder="Enter pickup location"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.input}
              value={destination}
              onChangeText={setDestination}
              placeholder="Enter destination in Majuli"
              placeholderTextColor={THEME.colors.textMuted}
            />
          </View>
        </View>

        {/* Fare Preview */}
        <View style={styles.card}>
          <View style={styles.fareHeader}>
            <Text style={styles.cardHeading}>Estimated Fare</Text>
            <Text style={styles.fareValue}>
              {fare.currency}
              {fare.totalFare}
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance</Text>
            <Text style={styles.fareDetail}>{fare.distanceKm} km</Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Est. Duration</Text>
            <Text style={styles.fareDetail}>{fare.durationMinutes} mins</Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Service Area</Text>
            <Text style={styles.fareDetail}>Majuli District, Assam</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => alert('Search for Captains will activate in Phase 5')}
          >
            <Text style={styles.buttonText}>Book MajuliGo Bike Taxi</Text>
          </TouchableOpacity>
        </View>

        {/* Phase Info Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Service Center: {MAJULI_CENTER_COORDINATES.name}
          </Text>
          <Text style={styles.footerSub}>Phase 1 Foundation Active</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scroll: {
    padding: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.background,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.text,
  },
  brandTagline: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  inputGroup: {
    marginBottom: THEME.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: THEME.colors.background,
    color: THEME.colors.text,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    fontSize: 14,
  },
  fareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  fareValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.colors.primary,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  fareLabel: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
  fareDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  buttonText: {
    color: THEME.colors.background,
    fontSize: 15,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
  },
  footerText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  footerSub: {
    color: THEME.colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});

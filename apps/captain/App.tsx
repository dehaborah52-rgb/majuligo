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
import { BRAND_NAME, BRAND_TAGLINE } from '@majuligo/shared';
import { THEME } from './src/constants/theme';

export default function App() {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.colors.background} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandTitle}>
              {BRAND_NAME} <Text style={{ color: THEME.colors.primary }}>Captain</Text>
            </Text>
            <Text style={styles.brandTagline}>{BRAND_TAGLINE}</Text>
          </View>
        </View>

        {/* Online / Offline Status Toggle Card */}
        <View style={[styles.card, isOnline ? styles.cardOnline : styles.cardOffline]}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.statusLabel}>Availability</Text>
              <Text style={styles.statusHeading}>
                {isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}
              </Text>
              <Text style={styles.statusSubtext}>
                {isOnline
                  ? 'Listening for ride requests in Majuli...'
                  : 'Go online to receive nearby ride requests'}
              </Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#475569', true: THEME.colors.online }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Today's Earnings Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Today's Earnings</Text>
          <Text style={styles.earningsValue}>₹840</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3.8 hrs</Text>
              <Text style={styles.statLabel}>Online Time</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4.9 ★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Active Dispatch Radar */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Dispatch Radar</Text>
          {isOnline ? (
            <View style={styles.radarActive}>
              <View style={styles.radarPulse} />
              <Text style={styles.radarText}>Scanning Kamalabari & Garamur...</Text>
            </View>
          ) : (
            <Text style={styles.radarMuted}>Switch to online mode to view incoming rides</Text>
          )}
        </View>

        {/* Document Status */}
        <View style={styles.card}>
          <View style={styles.docHeader}>
            <Text style={styles.cardHeading}>Verification Status</Text>
            <View style={styles.badgeApproved}>
              <Text style={styles.badgeText}>APPROVED</Text>
            </View>
          </View>
          <Text style={styles.docDetail}>Driving Licence & Bike RC verified</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MajuliGo Captain Network • Assam</Text>
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
    color: '#0F172A',
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
  cardOnline: {
    borderColor: THEME.colors.online,
    backgroundColor: '#064E3B20',
  },
  cardOffline: {
    borderColor: THEME.colors.border,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
  },
  statusHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.colors.text,
    marginTop: 2,
  },
  statusSubtext: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    maxWidth: 240,
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: THEME.spacing.xs,
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.colors.primary,
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: THEME.spacing.sm,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  radarActive: {
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
  },
  radarPulse: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.primary,
    marginBottom: 8,
  },
  radarText: {
    fontSize: 13,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  radarMuted: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    paddingVertical: THEME.spacing.sm,
  },
  docHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeApproved: {
    backgroundColor: '#065F46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.sm,
  },
  badgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: 'bold',
  },
  docDetail: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: THEME.spacing.md,
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

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';
import { Card, Input } from '../components';

export interface LocationItem {
  name: string;
  area: string;
  latitude: number;
  longitude: number;
  distanceHint?: string;
  type: 'GHAT' | 'SATRA' | 'MARKET' | 'COLLEGE';
}

export const POPULAR_MAJULI_LANDMARKS: LocationItem[] = [
  {
    name: 'Kamalabari Ghat',
    area: 'South Majuli (Ferry to Neemati Ghat/Jorhat)',
    latitude: 26.8872,
    longitude: 94.1843,
    distanceHint: 'Ferry Hub',
    type: 'GHAT',
  },
  {
    name: 'Garamur Satra',
    area: 'Central Majuli (District HQ & Civil Sub-division)',
    latitude: 26.9634,
    longitude: 94.2181,
    distanceHint: '8.5 km from Ghat',
    type: 'SATRA',
  },
  {
    name: 'Auniati Satra',
    area: 'West Majuli',
    latitude: 26.9421,
    longitude: 94.1523,
    distanceHint: '6.2 km from Center',
    type: 'SATRA',
  },
  {
    name: 'Jengraimukh Bazar',
    area: 'North Majuli Commercial Hub',
    latitude: 27.0984,
    longitude: 94.3412,
    distanceHint: '18 km from Garamur',
    type: 'MARKET',
  },
  {
    name: 'Dakhinpat Satra',
    area: 'South-East Majuli',
    latitude: 26.9124,
    longitude: 94.3129,
    distanceHint: '14 km from Kamalabari',
    type: 'SATRA',
  },
  {
    name: 'Majuli College Campus',
    area: 'Kamalabari Town',
    latitude: 26.9189,
    longitude: 94.1956,
    distanceHint: '3.5 km from Ghat',
    type: 'COLLEGE',
  },
];

export interface LocationSearchModalProps {
  title: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectLocation: (loc: LocationItem) => void;
  onClose: () => void;
}

export function LocationSearchModal({
  title,
  searchQuery,
  onSearchChange,
  onSelectLocation,
  onClose,
}: LocationSearchModalProps) {
  const filtered = POPULAR_MAJULI_LANDMARKS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: LocationItem['type']) => {
    switch (type) {
      case 'GHAT':
        return '⛵';
      case 'SATRA':
        return '🏛️';
      case 'MARKET':
        return '🛍️';
      case 'COLLEGE':
        return '🎓';
      default:
        return '📍';
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <Card elevated style={styles.modalCard}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Search ghats, satras, markets in Majuli..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />

        <Text style={styles.sectionLabel}>POPULAR MAJULI DESTINATIONS</Text>

        <ScrollView style={styles.scrollList}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.locationItem}
              onPress={() => onSelectLocation(item)}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{getIcon(item.type)}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.locationName}>{item.name}</Text>
                <Text style={styles.locationArea}>{item.area}</Text>
              </View>
              {item.distanceHint && (
                <Text style={styles.distanceHint}>{item.distanceHint}</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000099',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderTopLeftRadius: DESIGN_TOKENS.borderRadius.xl,
    borderTopRightRadius: DESIGN_TOKENS.borderRadius.xl,
    padding: DESIGN_TOKENS.spacing.base,
    maxHeight: '80%',
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  headerTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  closeButton: {
    padding: DESIGN_TOKENS.spacing.xs,
  },
  closeText: {
    color: DESIGN_TOKENS.colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.textSubtle,
    letterSpacing: 0.8,
    marginVertical: DESIGN_TOKENS.spacing.xs,
  },
  scrollList: {
    maxHeight: 280,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  icon: {
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    fontWeight: '600',
    color: DESIGN_TOKENS.colors.text,
  },
  locationArea: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 1,
  },
  distanceHint: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.primary,
    fontWeight: '600',
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DESIGN_TOKENS, translate } from '@majuligo/shared';

export interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{translate('noInternet', 'en')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: DESIGN_TOKENS.colors.danger,
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    paddingHorizontal: DESIGN_TOKENS.spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '700',
  },
});

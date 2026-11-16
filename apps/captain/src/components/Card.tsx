import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';

export interface CardProps {
  children: React.ReactNode;
  style?: Record<string, any>;
  elevated?: boolean;
}

export function Card({ children, style, elevated = false }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    padding: DESIGN_TOKENS.spacing.base,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
    marginBottom: DESIGN_TOKENS.spacing.md,
  },
  elevated: {
    backgroundColor: DESIGN_TOKENS.colors.surfaceElevated,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

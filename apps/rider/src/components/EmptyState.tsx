import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>🏝️</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <View style={styles.actionContainer}>
          <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: DESIGN_TOKENS.spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: DESIGN_TOKENS.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DESIGN_TOKENS.spacing.base,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
    marginBottom: DESIGN_TOKENS.spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: DESIGN_TOKENS.spacing.base,
    width: 160,
  },
});

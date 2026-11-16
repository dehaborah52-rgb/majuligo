import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'secondary':
        return styles.secondaryText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabledContainer,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <Text style={[styles.baseText, getTextStyle(), styles.loadingText]}>
          Loading...
        </Text>
      ) : (
        <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: DESIGN_TOKENS.touchTarget.minHeight,
  },
  fullWidth: {
    width: '100%',
  },
  primaryContainer: {
    backgroundColor: DESIGN_TOKENS.colors.primary,
  },
  secondaryContainer: {
    backgroundColor: DESIGN_TOKENS.colors.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  dangerContainer: {
    backgroundColor: DESIGN_TOKENS.colors.danger,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    opacity: 0.5,
  },
  sizeSm: {
    paddingVertical: DESIGN_TOKENS.spacing.xs,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    minHeight: 38,
  },
  sizeMd: {
    paddingVertical: DESIGN_TOKENS.spacing.sm,
    paddingHorizontal: DESIGN_TOKENS.spacing.base,
    minHeight: 48,
  },
  sizeLg: {
    paddingVertical: DESIGN_TOKENS.spacing.md,
    paddingHorizontal: DESIGN_TOKENS.spacing.xl,
    minHeight: 54,
  },
  baseText: {
    fontWeight: '700',
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
  },
  primaryText: {
    color: DESIGN_TOKENS.colors.textInverted,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: DESIGN_TOKENS.colors.text,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  ghostText: {
    color: DESIGN_TOKENS.colors.textMuted,
  },
  loadingText: {
    opacity: 0.8,
  },
});

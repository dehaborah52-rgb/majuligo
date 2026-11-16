import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: Record<string, any>;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = DESIGN_TOKENS.borderRadius.sm,
  style,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: DESIGN_TOKENS.colors.surfaceLightMuted ? '#253347' : '#2A374A',
    opacity: 0.6,
  },
});

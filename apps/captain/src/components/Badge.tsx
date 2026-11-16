import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DESIGN_TOKENS, RideStatus, CaptainVerificationStatus } from '@majuligo/shared';

export interface BadgeProps {
  status:
    | RideStatus
    | CaptainVerificationStatus
    | 'ONLINE'
    | 'OFFLINE'
    | 'APPROVED'
    | 'PENDING'
    | 'REJECTED';
  label?: string;
}

export function Badge({ status, label }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'ONLINE':
      case 'APPROVED':
      case CaptainVerificationStatus.APPROVED:
      case RideStatus.COMPLETED:
        return {
          bg: '#064E3B40',
          text: '#34D399',
          border: '#05966960',
        };
      case RideStatus.ACCEPTED:
      case RideStatus.IN_PROGRESS:
        return {
          bg: '#1E3A8A40',
          text: '#60A5FA',
          border: '#2563EB60',
        };
      case RideStatus.SEARCHING:
      case 'PENDING':
      case CaptainVerificationStatus.PENDING_VERIFICATION:
        return {
          bg: '#78350F40',
          text: '#FBBF24',
          border: '#D9770660',
        };
      case RideStatus.CANCELLED:
      case 'OFFLINE':
      case 'REJECTED':
      case CaptainVerificationStatus.REJECTED:
      case CaptainVerificationStatus.SUSPENDED:
      default:
        return {
          bg: '#33415540',
          text: '#94A3B8',
          border: '#47556960',
        };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: styleConfig.text }]}>
        {label || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DESIGN_TOKENS.spacing.sm,
    paddingVertical: 3,
    borderRadius: DESIGN_TOKENS.borderRadius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { DESIGN_TOKENS, translate } from '@majuligo/shared';
import { Button, Input, Card } from '../components';

export interface AuthScreenProps {
  onSuccess: (phone: string) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = () => {
    setError(null);
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 600);
  };

  const handleVerifyOtp = () => {
    setError(null);
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(phone);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.brandTitle}>
            Majuli<Text style={{ color: DESIGN_TOKENS.colors.primary }}>Go</Text>
          </Text>
          <Text style={styles.tagline}>{translate('tagline', 'en')}</Text>
        </View>

        {/* Auth Form Card */}
        <Card elevated>
          <Text style={styles.formTitle}>
            {step === 'PHONE' ? 'Sign In / Register' : 'Verify Mobile Number'}
          </Text>
          <Text style={styles.formSubtitle}>
            {step === 'PHONE'
              ? 'Enter your mobile number to book bike rides across Majuli'
              : `Enter the verification code sent to +91 ${phone}`}
          </Text>

          {step === 'PHONE' ? (
            <>
              <Input
                label="Mobile Number"
                prefix="+91"
                value={phone}
                onChangeText={(val) => setPhone(val.replace(/\D/g, ''))}
                placeholder="98765 43210"
                keyboardType="numeric"
                maxLength={10}
                error={error || undefined}
              />
              <Button
                title={translate('sendOtp', 'en')}
                onPress={handleSendOtp}
                loading={loading}
              />
            </>
          ) : (
            <>
              <Input
                label="Enter 6-Digit OTP"
                value={otp}
                onChangeText={(val) => setOtp(val.replace(/\D/g, ''))}
                placeholder="123456"
                keyboardType="numeric"
                maxLength={6}
                error={error || undefined}
              />
              <View style={styles.devHint}>
                <Text style={styles.devHintText}>💡 Dev mode OTP code: 123456</Text>
              </View>
              <Button
                title={translate('verifyOtp', 'en')}
                onPress={handleVerifyOtp}
                loading={loading}
              />
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => setStep('PHONE')}
              >
                <Text style={styles.resendText}>← Change Phone Number</Text>
              </TouchableOpacity>
            </>
          )}
        </Card>

        {/* Footer Disclaimer */}
        <Text style={styles.termsText}>{translate('termsNotice', 'en')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_TOKENS.colors.background,
  },
  content: {
    flex: 1,
    padding: DESIGN_TOKENS.spacing.base,
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.xl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    backgroundColor: DESIGN_TOKENS.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.textInverted,
  },
  brandTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.display,
    fontWeight: '900',
    color: DESIGN_TOKENS.colors.text,
  },
  tagline: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  formTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.subheading,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  formSubtitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    color: DESIGN_TOKENS.colors.textMuted,
    marginBottom: DESIGN_TOKENS.spacing.base,
    lineHeight: 18,
  },
  devHint: {
    backgroundColor: '#3B82F620',
    padding: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.sm,
    marginBottom: DESIGN_TOKENS.spacing.md,
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  devHintText: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    color: '#60A5FA',
    textAlign: 'center',
    fontWeight: '600',
  },
  resendButton: {
    marginTop: DESIGN_TOKENS.spacing.md,
    alignItems: 'center',
  },
  resendText: {
    color: DESIGN_TOKENS.colors.primary,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textSubtle,
    marginTop: DESIGN_TOKENS.spacing.lg,
    paddingHorizontal: DESIGN_TOKENS.spacing.base,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import {
  DESIGN_TOKENS,
  CaptainVerificationStatus,
  translate,
} from '@majuligo/shared';
import { Button, Input, Card, Badge } from '../components';

export interface CaptainAuthScreenProps {
  onSuccess: (phone: string) => void;
}

export function CaptainAuthScreen({ onSuccess }: CaptainAuthScreenProps) {
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'DOCUMENTS'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulated Captain KYC status
  const [kycStatus, _setKycStatus] = useState<CaptainVerificationStatus>(
    CaptainVerificationStatus.APPROVED
  );

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
    }, 500);
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
      setStep('DOCUMENTS');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.brandTitle}>
            Majuli<Text style={{ color: DESIGN_TOKENS.colors.secondary }}>Captain</Text>
          </Text>
          <Text style={styles.tagline}>{translate('captainWelcome', 'en')}</Text>
        </View>

        {step === 'PHONE' && (
          <Card elevated>
            <Text style={styles.formTitle}>Captain Sign In</Text>
            <Text style={styles.formSubtitle}>
              Register or sign in with your phone to start accepting rides in Majuli
            </Text>
            <Input
              label="Registered Mobile Number"
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
              variant="secondary"
            />
          </Card>
        )}

        {step === 'OTP' && (
          <Card elevated>
            <Text style={styles.formTitle}>Verify Mobile</Text>
            <Text style={styles.formSubtitle}>Enter the code sent to +91 {phone}</Text>
            <Input
              label="6-Digit OTP Code"
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
              title="Verify & Enter Dashboard"
              onPress={handleVerifyOtp}
              loading={loading}
              variant="secondary"
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setStep('PHONE')}
            >
              <Text style={styles.backButtonText}>← Change Phone Number</Text>
            </TouchableOpacity>
          </Card>
        )}

        {step === 'DOCUMENTS' && (
          <Card elevated>
            <View style={styles.statusRow}>
              <Text style={styles.formTitle}>Captain KYC Verification</Text>
              <Badge status={kycStatus} />
            </View>
            <Text style={styles.formSubtitle}>
              Only verified captains with approved documents can accept live rides.
            </Text>

            {/* Document Checklist */}
            <View style={styles.docItem}>
              <Text style={styles.docIcon}>🪪</Text>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>Driving Licence (DL)</Text>
                <Text style={styles.docSub}>Verified: DL-AS03-202200148</Text>
              </View>
              <Text style={styles.docChecked}>✓</Text>
            </View>

            <View style={styles.docItem}>
              <Text style={styles.docIcon}>📜</Text>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>Vehicle Registration (RC)</Text>
                <Text style={styles.docSub}>Verified: AS-03-AQ-4219 (Hero Splendor)</Text>
              </View>
              <Text style={styles.docChecked}>✓</Text>
            </View>

            <View style={styles.docItem}>
              <Text style={styles.docIcon}>🛡️</Text>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>Vehicle Insurance</Text>
                <Text style={styles.docSub}>Valid until Dec 2027</Text>
              </View>
              <Text style={styles.docChecked}>✓</Text>
            </View>

            <Button
              title="Proceed to Duty Dashboard →"
              onPress={() => onSuccess(phone)}
              variant="secondary"
              size="lg"
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_TOKENS.colors.background,
  },
  scroll: {
    padding: DESIGN_TOKENS.spacing.base,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.xl,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: DESIGN_TOKENS.borderRadius.lg,
    backgroundColor: DESIGN_TOKENS.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DESIGN_TOKENS.spacing.sm,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.spacing.xs,
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
  backButton: {
    marginTop: DESIGN_TOKENS.spacing.md,
    alignItems: 'center',
  },
  backButtonText: {
    color: DESIGN_TOKENS.colors.secondary,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '600',
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: DESIGN_TOKENS.spacing.sm,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    marginBottom: DESIGN_TOKENS.spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
  },
  docIcon: {
    fontSize: 20,
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: DESIGN_TOKENS.typography.fontSize.bodySm,
    fontWeight: '700',
    color: DESIGN_TOKENS.colors.text,
  },
  docSub: {
    fontSize: DESIGN_TOKENS.typography.fontSize.micro,
    color: DESIGN_TOKENS.colors.textMuted,
    marginTop: 2,
  },
  docChecked: {
    fontSize: 16,
    color: DESIGN_TOKENS.colors.secondary,
    fontWeight: '900',
    marginRight: DESIGN_TOKENS.spacing.xs,
  },
});

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { DESIGN_TOKENS } from '@majuligo/shared';

export interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
  prefix?: string;
  maxLength?: number;
  secureTextEntry?: boolean;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  prefix,
  maxLength,
  secureTextEntry = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, !!error && styles.inputError]}>
        {prefix && <Text style={styles.prefix}>{prefix}</Text>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={DESIGN_TOKENS.colors.textSubtle}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: DESIGN_TOKENS.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    fontWeight: '600',
    color: DESIGN_TOKENS.colors.textMuted,
    marginBottom: DESIGN_TOKENS.spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN_TOKENS.colors.surface,
    borderWidth: 1,
    borderColor: DESIGN_TOKENS.colors.surfaceBorder,
    borderRadius: DESIGN_TOKENS.borderRadius.md,
    paddingHorizontal: DESIGN_TOKENS.spacing.md,
    minHeight: DESIGN_TOKENS.touchTarget.minHeight,
  },
  inputError: {
    borderColor: DESIGN_TOKENS.colors.danger,
  },
  prefix: {
    color: DESIGN_TOKENS.colors.primary,
    fontWeight: '700',
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    marginRight: DESIGN_TOKENS.spacing.sm,
  },
  input: {
    flex: 1,
    color: DESIGN_TOKENS.colors.text,
    fontSize: DESIGN_TOKENS.typography.fontSize.body,
    paddingVertical: DESIGN_TOKENS.spacing.sm,
  },
  errorText: {
    color: DESIGN_TOKENS.colors.danger,
    fontSize: DESIGN_TOKENS.typography.fontSize.caption,
    marginTop: 4,
  },
});

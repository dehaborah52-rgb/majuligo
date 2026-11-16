/**
 * MajuliGo Unified Design Tokens
 * Used across Rider App, Captain App, and Admin Portal
 */

export const DESIGN_TOKENS = {
  colors: {
    // Brand Primary - Golden Amber (High daylight visibility on Assam roads)
    primary: '#F59E0B',
    primaryDark: '#D97706',
    primaryLight: '#FEF3C7',
    primaryForeground: '#0F172A',

    // Secondary / Driver Success - Emerald Green
    secondary: '#10B981',
    secondaryDark: '#059669',
    secondaryLight: '#D1FAE5',
    secondaryForeground: '#FFFFFF',

    // Dark Backgrounds & Surfaces (Low eye strain, battery efficiency for OLED phones)
    background: '#0F172A', // Slate 900
    backgroundDark: '#0B0F19', // Slate 950
    surface: '#1E293B', // Slate 800
    surfaceElevated: '#283548',
    surfaceBorder: '#334155', // Slate 700

    // Light Theme / Admin Surfaces
    surfaceLight: '#FFFFFF',
    surfaceLightMuted: '#F8FAFC',
    borderLight: '#E2E8F0',

    // Text & Foreground
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    textSubtle: '#64748B',
    textInverted: '#0F172A',

    // System States
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',

    // Availability States
    online: '#10B981',
    offline: '#64748B',
    busy: '#F59E0B',
  },

  typography: {
    fontSize: {
      micro: 10,
      caption: 12,
      bodySm: 13,
      body: 14,
      bodyLg: 16,
      subheading: 18,
      heading: 20,
      title: 24,
      display: 32,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero: 48,
  },

  borderRadius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 9999,
  },

  touchTarget: {
    // 48dp minimum touch target recommended by Google Material and Apple HIG
    minHeight: 48,
    minWidth: 48,
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;

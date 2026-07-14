export const colors = {
  // Primary Islamic colors
  primary: '#1B5E20',
  primaryLight: '#4C8C4A',
  primaryDark: '#003300',
  
  // Gold accents
  gold: '#D4AF37',
  goldLight: '#F4D03F',
  goldDark: '#B8860B',
  
  // Background colors
  backgroundDark: '#0A1612',
  backgroundLight: '#F5F5F5',
  cardDark: '#1A2A24',
  cardLight: '#FFFFFF',
  
  // Text colors
  textDark: '#FFFFFF',
  textLight: '#1A1A1A',
  textSecondaryDark: '#A0A0A0',
  textSecondaryLight: '#666666',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Prayer colors
  fajr: '#3F51B5',
  sunrise: '#FF9800',
  dhuhr: '#FFEB3B',
  asr: '#FF5722',
  maghrib: '#9C27B0',
  isha: '#1A237E',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  arabic: {
    fontFamily: 'System',
    fontSize: 24,
    lineHeight: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

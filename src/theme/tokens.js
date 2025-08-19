// Based on UI guidelines with light/dark mode support

const baseTokens = {
    // Spacing system (4/8 grid)
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32
    },
  
    // Border radius
    radii: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      round: 999
    },
  
    // Typography scale
    fontSizes: {
      caption: 12,
      body: 14,
      subtitle: 16,
      title: 18,
      heading: 20,
      display: 24
    },
  
    // Font weights
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
  
    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6
    },
  
    // Shadows/elevation
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0
      },
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4
      }
    }
  };
  
  // Light theme colors
  const lightColors = {
    // Primary brand colors
    primary: '#6366f1',
    primaryLight: '#8b5cf6',
    primaryDark: '#4f46e5',
  
    // Semantic colors
    success: '#22c55e',
    successLight: '#4ade80',
    successDark: '#16a34a',
    
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    
    info: '#3b82f6',
    infoLight: '#60a5fa',
    infoDark: '#2563eb',
  
    // Neutral colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    surface: '#ffffff',
    surfaceSecondary: '#f1f5f9',
    
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    textDisabled: '#cbd5e1',
    textInverse: '#ffffff',
  
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.25)'
  };
  
  // Dark theme colors
  const darkColors = {
    // Primary brand colors (slightly adjusted for dark mode)
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryDark: '#7c3aed',
  
    // Semantic colors
    success: '#22c55e',
    successLight: '#4ade80',
    successDark: '#16a34a',
    
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    
    info: '#3b82f6',
    infoLight: '#60a5fa',
    infoDark: '#2563eb',
  
    // Neutral colors (inverted)
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    
    border: '#475569',
    borderLight: '#64748b',
    borderDark: '#334155',
    
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textDisabled: '#64748b',
    textInverse: '#1e293b',
  
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.75)',
    overlayLight: 'rgba(0, 0, 0, 0.5)'
  };
  
  // Create theme objects
  export const lightTheme = {
    ...baseTokens,
    colors: lightColors
  };
  
  export const darkTheme = {
    ...baseTokens,
    colors: darkColors
  };
  
  // Default export
  export default lightTheme;
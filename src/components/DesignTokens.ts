/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🇸🇩 REPUBLIC OF SUDAN | DIGITAL MINISTRY OF COMMERCE & INDUSTRY
 * SGDS (Sovereign Government Design System) - Design Tokens v1.0.0
 * Centralized Single Source of Truth
 */

// ==========================================
// 1. TYPOGRAPHY TOKENS (DIN Next & DIN Next Arabic)
// ==========================================
export interface TypographySpec {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: string;
  responsiveScale?: string;
}

export const TYPOGRAPHY_TOKENS = {
  fontFamily: {
    arabic: "'DIN Next Arabic', 'Inter', system-ui, sans-serif",
    english: "'DIN Next', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace"
  },
  weights: {
    light: "300",
    regular: "400",
    medium: "500",
    bold: "700",
    black: "900"
  },
  scale: {
    displayXXL: {
      fontFamily: "var(--font-arabic)",
      fontSize: "3.5rem", // 56px
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
      fontWeight: "900",
      responsiveScale: "text-4xl md:text-6xl"
    },
    displayXL: {
      fontFamily: "var(--font-arabic)",
      fontSize: "2.5rem", // 40px
      lineHeight: "1.15",
      letterSpacing: "-0.015em",
      fontWeight: "900",
      responsiveScale: "text-3xl md:text-5xl"
    },
    displayLarge: {
      fontFamily: "var(--font-arabic)",
      fontSize: "2rem", // 32px
      lineHeight: "1.2",
      letterSpacing: "-0.01em",
      fontWeight: "700",
      responsiveScale: "text-2xl md:text-4xl"
    },
    h1: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1.75rem", // 28px
      lineHeight: "1.3",
      letterSpacing: "-0.01em",
      fontWeight: "700",
      responsiveScale: "text-xl md:text-3xl"
    },
    h2: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1.5rem", // 24px
      lineHeight: "1.35",
      letterSpacing: "-0.005em",
      fontWeight: "700",
      responsiveScale: "text-lg md:text-2xl"
    },
    h3: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1.25rem", // 20px
      lineHeight: "1.4",
      letterSpacing: "0",
      fontWeight: "700",
      responsiveScale: "text-base md:text-xl"
    },
    h4: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1.125rem", // 18px
      lineHeight: "1.45",
      letterSpacing: "0",
      fontWeight: "700"
    },
    h5: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1rem", // 16px
      lineHeight: "1.5",
      letterSpacing: "0",
      fontWeight: "500"
    },
    h6: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem", // 14px
      lineHeight: "1.5",
      letterSpacing: "0.005em",
      fontWeight: "500"
    },
    subtitle: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1rem",
      lineHeight: "1.5",
      letterSpacing: "0",
      fontWeight: "500"
    },
    bodyLarge: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1.125rem",
      lineHeight: "1.6",
      letterSpacing: "0",
      fontWeight: "400"
    },
    bodyMedium: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1rem",
      lineHeight: "1.6",
      letterSpacing: "0",
      fontWeight: "400"
    },
    bodySmall: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.6",
      letterSpacing: "0",
      fontWeight: "400"
    },
    caption: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.75rem",
      lineHeight: "1.4",
      letterSpacing: "0.01em",
      fontWeight: "400"
    },
    overline: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.6875rem",
      lineHeight: "1.3",
      letterSpacing: "0.1em",
      fontWeight: "700"
    },
    label: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.4",
      letterSpacing: "0.005em",
      fontWeight: "500"
    },
    button: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1",
      letterSpacing: "0.01em",
      fontWeight: "700"
    },
    input: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.4",
      letterSpacing: "0",
      fontWeight: "400"
    },
    table: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      letterSpacing: "0",
      fontWeight: "400"
    },
    sidebar: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.4",
      letterSpacing: "0",
      fontWeight: "500"
    },
    tooltip: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.75rem",
      lineHeight: "1.3",
      letterSpacing: "0",
      fontWeight: "400"
    },
    dialog: {
      fontFamily: "var(--font-arabic)",
      fontSize: "1rem",
      lineHeight: "1.5",
      letterSpacing: "0",
      fontWeight: "500"
    },
    notification: {
      fontFamily: "var(--font-arabic)",
      fontSize: "0.875rem",
      lineHeight: "1.5",
      letterSpacing: "0",
      fontWeight: "500"
    }
  }
};

// ==========================================
// 2. SOVEREIGN SPACING SYSTEM (8px Grid Multiples)
// ==========================================
export const SPACING_TOKENS = {
  px2: "0.125rem",   // 2px
  px4: "0.25rem",    // 4px
  px8: "0.5rem",     // 8px (Base Unit)
  px12: "0.75rem",   // 12px
  px16: "1rem",      // 16px
  px20: "1.25rem",   // 20px
  px24: "1.5rem",    // 24px
  px32: "2rem",      // 32px
  px40: "2.5rem",    // 40px
  px48: "3rem",      // 48px
  px56: "3.5rem",    // 56px
  px64: "4rem",      // 64px
  px72: "4.5rem",    // 72px
  px80: "5rem",      // 80px
  px96: "6rem",      // 96px
  px120: "7.5rem",   // 120px
  px160: "10rem",    // 160px
  px200: "12.5rem"   // 200px
};

// ==========================================
// 3. CORNER RADIUS TOKENS (Sovereign Shapes)
// ==========================================
export const RADIUS_TOKENS = {
  none: "0px",
  xs: "4px",        // Form controls, small badges
  small: "8px",     // Checkbox panels, utility elements
  medium: "12px",   // Standard input fields, action buttons
  large: "16px",    // Content cards, sub-dashboards
  xl: "20px",       // Process wizards, modals
  "2xl": "24px",      // Main modules, sovereign banners
  round: "32px",    // Giant callout cards, heroic dialogs
  pill: "9999px",   // Badges, tags, toggle sliders
  circle: "50%"     // Avatars, indicators
};

// ==========================================
// 4. BORDER & ELEVATION (Shadows)
// ==========================================
export const BORDER_TOKENS = {
  widths: {
    none: "0px",
    thin: "1px",
    regular: "2px",
    strong: "3px",
    focused: "2px",
    selected: "3px"
  },
  styles: {
    solid: "solid",
    dashed: "dashed",
    dotted: "dotted"
  }
};

export const SHADOW_TOKENS = {
  light: {
    soft: "0 1px 3px rgba(0,0,0,0.05)",
    card: "0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02)",
    hover: "0 10px 15px -3px rgba(0,74,30,0.04), 0 4px 6px -2px rgba(0,74,30,0.02)",
    floating: "0 15px 30px -5px rgba(0,0,0,0.06), 0 5px 15px -5px rgba(0,0,0,0.03)",
    modal: "0 20px 40px -8px rgba(0,0,0,0.08), 0 10px 20px -8px rgba(0,0,0,0.04)",
    dropdown: "0 8px 16px -2px rgba(0,0,0,0.05), 0 4px 8px -2px rgba(0,0,0,0.02)",
    navigation: "0 2px 10px rgba(0,0,0,0.03)",
    ai: "0 12px 24px -4px rgba(197,160,89,0.08), 0 4px 12px -4px rgba(197,160,89,0.03)",
    dashboard: "0 6px 12px -2px rgba(0,0,0,0.03)",
    high: "0 25px 50px -12px rgba(0,0,0,0.1)"
  },
  dark: {
    soft: "0 1px 3px rgba(0,0,0,0.3)",
    card: "0 4px 12px rgba(0,0,0,0.4)",
    hover: "0 10px 20px rgba(0,122,51,0.06)",
    floating: "0 15px 30px rgba(0,0,0,0.5)",
    modal: "0 20px 50px rgba(0,0,0,0.6)",
    dropdown: "0 8px 24px rgba(0,0,0,0.45)",
    navigation: "0 2px 16px rgba(0,0,0,0.4)",
    ai: "0 12px 28px rgba(197,160,89,0.12)",
    dashboard: "0 6px 16px rgba(0,0,0,0.35)",
    high: "0 25px 60px rgba(0,0,0,0.55)"
  }
};

// ==========================================
// 5. MOTION & TRANSITION TOKENS
// ==========================================
export const MOTION_TOKENS = {
  duration: {
    instant: "0ms",
    fast: "150ms",     // Toggle, button hover, click feedback
    normal: "300ms",   // Tab switches, slide drawers, collapse
    slow: "500ms",     // Complex wizard step slide-ins, page transitions
    verySlow: "800ms"  // Large background load transitions, hero entry
  },
  easing: {
    linear: "linear",
    bounce: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",   // Interactive pop, stamp-effect
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",           // Perfect sleek hover
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  safeguards: {
    reducedMotion: "@media (prefers-reduced-motion: reduce) { transition: none !important; animation: none !important; }"
  }
};

// ==========================================
// 6. LAYER SCALES (Z-INDEX TOKENS)
// ==========================================
export const Z_INDEX_TOKENS = {
  background: 0,
  card: 10,
  dropdown: 100,
  tooltip: 200,
  floatingAction: 300,
  sidebar: 400,
  header: 500,
  drawer: 600,
  modal: 700,
  notification: 800,
  ai: 900,
  loadingScreen: 1000,
  emergencyAlert: 2000
};

// ==========================================
// 7. LAYOUT & RESPONSIVE BREAKPOINTS
// ==========================================
export const LAYOUT_TOKENS = {
  widths: {
    containerMax: "80rem",    // 1280px
    sidebarExpanded: "18rem", // 288px
    sidebarCollapsed: "5rem",  // 80px
    contentMax: "74rem",      // 1184px
    dashboardMax: "90rem",    // 1440px
    dialogStandard: "36rem",  // 576px
    drawerStandard: "24rem"   // 384px
  },
  heights: {
    navigationTop: "4.5rem",  // 72px
    footerStandard: "16rem",  // 256px
    inputField: "3rem"        // 48px
  }
};

export const RESPONSIVE_TOKENS = {
  breakpoints: {
    mobileSmall: "320px",
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1280px",
    largeDesktop: "1440px",
    ultraWide: "1920px"
  },
  grid: {
    mobile: {
      columns: 4,
      margin: "1rem",
      gutter: "1rem"
    },
    tablet: {
      columns: 8,
      margin: "1.5rem",
      gutter: "1.5rem"
    },
    desktop: {
      columns: 12,
      margin: "2rem",
      gutter: "1.5rem"
    }
  }
};

// ==========================================
// 8. OPACITY & ICON TOKENS
// ==========================================
export const OPACITY_TOKENS = {
  solid: 1,
  pressed: 0.9,
  hover: 0.85,
  selected: 0.15,
  focus: 0.12,
  backdrop: 0.6,
  overlay: 0.5,
  loading: 0.4,
  disabled: 0.38
};

export const ICON_TOKENS = {
  sizes: {
    tiny: "1rem",        // 16px
    small: "1.25rem",    // 20px
    medium: "1.5rem",    // 24px (Standard Navigation)
    large: "2rem",       // 32px (Header Accent)
    hero: "3rem"         // 48px (Status Dialogs)
  },
  strokeWidth: {
    thin: "1.5px",
    regular: "2px",
    strong: "2.5px"
  }
};

// ==========================================
// 9. DATA VISUALIZATION & CHART TOKENS
// ==========================================
export const DATA_VIS_TOKENS = {
  palette: [
    "#007A33", // Green (Primary)
    "#C5A059", // Gold (Accent)
    "#1E3A8A", // Deep Navy (Investment Focus)
    "#0D9488", // Teal (Manufacturing/Industry)
    "#2563EB", // Royal Blue (Imports & Trade)
    "#7C3AED", // Violet (Technology)
    "#DB2777"  // Crimson (Enforcements)
  ],
  kpi: {
    approved: "#10B981",
    pending: "#F59E0B",
    rejected: "#EF4444",
    draft: "#6B7280"
  },
  heatMap: {
    low: "#E0F2FE",
    medium: "#7DD3FC",
    high: "#0284C7",
    extreme: "#0369A1"
  }
};

// ==========================================
// 10. DETAILED SOVEREIGN COLOR SCALES (50-950)
// ==========================================
export const COLOR_SCALES = {
  sudanGreen: {
    50: "#E6F5EC",
    100: "#C2E6D2",
    200: "#99D4B5",
    300: "#6FC197",
    400: "#4AA47C",
    500: "#007A33", // Primary National Brand Green
    600: "#006E2E",
    700: "#005F27",
    800: "#005020",
    900: "#003A17",
    950: "#00240E"
  },
  sudanGold: {
    50: "#FAF6EB",
    100: "#F1E7CC",
    200: "#E3D1A5",
    300: "#D5B87D",
    400: "#C9A55B",
    500: "#C5A059", // Accent Mineral Gold
    600: "#AA8648",
    700: "#8E6D38",
    800: "#735429",
    900: "#5A3F1F",
    950: "#442D15"
  },
  sovereignDark: {
    50: "#F9F9F9",
    100: "#EFEFEF",
    200: "#DFDFDF",
    300: "#C5C5C5",
    400: "#8E8E8E",
    500: "#1A1A1A", // Primary Dark Interface Surface
    600: "#171717",
    700: "#141414",
    800: "#111111",
    900: "#0A0A0A",
    950: "#050505"
  },
  semanticSuccess: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    500: "#10B981",
    700: "#047857",
    950: "#022C22"
  },
  semanticWarning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    700: "#B45309",
    950: "#451A03"
  },
  semanticError: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    700: "#B91C1C",
    950: "#450A0A"
  },
  semanticInfo: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    500: "#0284C7",
    700: "#0369A1",
    950: "#082F49"
  }
};

// ==========================================
// 11. SEMANTIC APPLICATION TOKENS (LIGHT vs DARK)
// ==========================================
export const SEMANTIC_LIGHT_THEME = {
  // Surface
  background: "#F4F6F5", // Sovereign off-white
  surfaceCard: "#FFFFFF",
  surfaceCardSecondary: "#F9FAFB",
  surfaceSidebar: "#FFFFFF",
  surfaceHeader: "#FFFFFF",
  surfaceFooter: "#1A1A1A",
  surfaceOverlay: "rgba(0,0,0,0.5)",
  
  // Interactive Elements
  primary: "#007A33",
  primaryHover: "#006E2E",
  primaryActive: "#005F27",
  primarySurface: "#E6F5EC",
  
  secondary: "#C5A059",
  secondaryHover: "#AA8648",
  secondaryActive: "#8E6D38",
  secondarySurface: "#FAF6EB",
  
  danger: "#EF4444",
  dangerHover: "#D32F2F",
  dangerSurface: "#FEF2F2",
  
  success: "#10B981",
  successSurface: "#ECFDF5",
  
  warning: "#F59E0B",
  warningSurface: "#FFFBEB",
  
  info: "#0284C7",
  infoSurface: "#F0F9FF",
  
  // States
  disabled: "#D1D5DB",
  disabledText: "#9CA3AF",
  focusRing: "#007A33",
  
  // Borders
  borderThin: "#E5E7EB",
  borderRegular: "#D1D5DB",
  borderStrong: "#9CA3AF",
  divider: "#F3F4F6",
  
  // Texts
  textPrimary: "#1A1A1A",
  textSecondary: "#4B5563",
  textTertiary: "#9CA3AF",
  textOnPrimary: "#FFFFFF",
  textOnSecondary: "#FFFFFF",
  
  // Tables
  tableHeaderBackground: "#F9FAFB",
  tableRowBackground: "#FFFFFF",
  tableRowHover: "#F3F4F6",
  tableRowSelected: "#E6F5EC",
  
  // Special modules
  aiPrimary: "#C5A059",
  aiGradientStart: "#C5A059",
  aiGradientEnd: "#AA8648",
  aiBg: "#FAF6EB",
  aiHighlight: "rgba(197, 160, 89, 0.1)"
};

export const SEMANTIC_DARK_THEME = {
  // Surface
  background: "#0A0A0A", // Sovereign Pitch Black
  surfaceCard: "#141414",
  surfaceCardSecondary: "#1E1E1E",
  surfaceSidebar: "#111111",
  surfaceHeader: "#111111",
  surfaceFooter: "#050505",
  surfaceOverlay: "rgba(0,0,0,0.8)",
  
  // Interactive Elements
  primary: "#007A33",
  primaryHover: "#009C41",
  primaryActive: "#22C55E",
  primarySurface: "#00240E",
  
  secondary: "#C5A059",
  secondaryHover: "#D8B87B",
  secondaryActive: "#E9D2A3",
  secondarySurface: "#442D15",
  
  danger: "#EF4444",
  dangerHover: "#F87171",
  dangerSurface: "#450A0A",
  
  success: "#10B981",
  successSurface: "#022C22",
  
  warning: "#F59E0B",
  warningSurface: "#451A03",
  
  info: "#38BDF8",
  infoSurface: "#082F49",
  
  // States
  disabled: "#374151",
  disabledText: "#6B7280",
  focusRing: "#C5A059",
  
  // Borders
  borderThin: "#262626",
  borderRegular: "#404040",
  borderStrong: "#737373",
  divider: "#1F1F1F",
  
  // Texts
  textPrimary: "#F5F5F5",
  textSecondary: "#A3A3A3",
  textTertiary: "#737373",
  textOnPrimary: "#FFFFFF",
  textOnSecondary: "#1A1A1A",
  
  // Tables
  tableHeaderBackground: "#171717",
  tableRowBackground: "#141414",
  tableRowHover: "#1E1E1E",
  tableRowSelected: "#00240E",
  
  // Special modules
  aiPrimary: "#D8B87B",
  aiGradientStart: "#D8B87B",
  aiGradientEnd: "#C5A059",
  aiBg: "#221910",
  aiHighlight: "rgba(216, 184, 123, 0.15)"
};

// ==========================================
// 12. COMPONENT-SPECIFIC SECTIONS
// ==========================================
export const COMPONENT_TOKENS = {
  form: {
    inputHeight: "3rem",
    inputPadding: "1rem",
    inputRadius: "12px",
    inputBorder: "1px solid var(--border-regular)",
    inputFocusBorder: "2px solid var(--primary)",
    labelMarginBottom: "0.5rem"
  },
  table: {
    headerHeight: "3.5rem",
    rowHeight: "3.25rem",
    paddingX: "1.5rem",
    paddingY: "1rem",
    borderWidth: "1px"
  },
  notification: {
    toastRadius: "16px",
    toastShadow: "shadow-lg",
    toastPadding: "1rem 1.25rem"
  }
};

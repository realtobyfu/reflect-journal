// Design System for Reflect Journal
// A coherent, modern design language focused on clarity and usability

export const colors = {
  // Primary palette - Soft, calming blues
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Neutral palette - Warm grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: {
    light: '#86efac',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fde047',
    DEFAULT: '#eab308',
    dark: '#ca8a04',
  },
  error: {
    light: '#fca5a5',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  
  // Mood colors
  moods: {
    amazing: '#22c55e',
    good: '#3b82f6',
    okay: '#eab308',
    bad: '#f97316',
    terrible: '#ef4444',
  },
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const typography = {
  // Font families
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Consolas, monospace',
  },
  
  // Font sizes
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  
  // Line heights
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component-specific styles
export const components = {
  card: {
    base: 'bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden',
    hover: 'hover:shadow-md hover:border-neutral-300 transition-all duration-200',
    padding: 'p-6',
  },
  
  button: {
    base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variants: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-500',
      ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500',
      danger: 'bg-error text-white hover:bg-error-dark focus:ring-error',
    },
  },
  
  input: {
    base: 'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    error: 'border-error focus:ring-error',
  },
  
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variants: {
      default: 'bg-neutral-100 text-neutral-800',
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    },
  },
};

// Animation keyframes
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideIn: {
    from: { transform: 'translateY(10px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
};

// Z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};
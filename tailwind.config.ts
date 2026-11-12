import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors (from design tokens)
        brand: {
          primary: '#FF6A00',
          'primary-hover': '#E85A00',
          'primary-active': '#D14900',
          secondary: '#FFC01E',
          accent: '#E01F26',
          'accent-hover': '#C01520',
          success: '#2e7d32',
          warning: '#f9a825',
          info: '#17a2b8',
        },
        // Semantic colors (from design tokens)
        ink: '#232D3F',
        slate: '#55657B',
        'text-muted': '#6b7280',
        border: '#e5e7eb',
        'border-light': '#f0f3f7',
        'surface-brand': '#f7f9fa',
        'surface-light': '#f0f8ff',
        cream: '#fef3e2',
        overlay: 'rgba(0, 0, 0, 0.5)',
      },
      spacing: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['12px', { lineHeight: '1.5' }],
        base: ['13px', { lineHeight: '1.5' }],
        lg: ['14px', { lineHeight: '1.5' }],
        xl: ['15px', { lineHeight: '1.5' }],
        '2xl': ['16px', { lineHeight: '1.4' }],
        '3xl': ['20px', { lineHeight: '1.3' }],
        '4xl': ['26px', { lineHeight: '1.3' }],
        '5xl': ['28px', { lineHeight: '1.3' }],
        '6xl': ['64px', { lineHeight: '1' }],
      },
      fontWeight: {
        normal: '400',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 30px rgba(35, 45, 63, 0.1)',
        'focus-ring': '0 0 0 3px rgba(255, 106, 0, 0.1)',
        'danger-ring': '0 0 0 3px rgba(224, 31, 38, 0.1)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #FF6A00 0%, #E85A00 100%)',
      },
    },
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};

export default config;

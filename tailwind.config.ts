import type { Config } from 'tailwindcss';

/**
 * Brand tokens: black, blue and green.
 * - accent: blue for text, icons and lines on dark backgrounds (6:1 on charcoal)
 * - accent-deep / accent-hover: blue button fills with white text (5.5:1)
 * - accent-ink / green-ink: darker shades for text on light backgrounds (AA)
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      // 1440px on large monitors so wide screens are not mostly empty margin.
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1240px', '2xl': '1440px' },
    },
    extend: {
      colors: {
        charcoal: '#0B0F14',
        steel: { DEFAULT: '#161C24', light: '#232B36' },
        offwhite: '#F4F6F9',
        ink: '#0F172A',
        muted: { DEFAULT: '#475569', dark: '#94A3B8' },
        accent: { DEFAULT: '#4C8DFF', deep: '#1F5FE0', hover: '#184BB8', ink: '#1D4ED8' },
        green: { DEFAULT: '#16A34A', bright: '#22C55E', ink: '#15803D' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Narrow', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 7vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2.1rem, 5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.75rem, 3.4vw, 2.5rem)', { lineHeight: '1.05' }],
        eyebrow: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.16em' }],
      },
      spacing: {
        section: 'clamp(3.5rem, 8vw, 7rem)',
      },
      maxWidth: { prose: '76ch' },
      boxShadow: {
        lift: '0 20px 50px -20px rgb(0 0 0 / 0.55)',
        card: '0 1px 2px rgb(17 19 24 / 0.06), 0 8px 24px -12px rgb(17 19 24 / 0.18)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        kenburns: {
          from: { transform: 'scale(1) translate3d(0,0,0)' },
          to: { transform: 'scale(1.12) translate3d(-1.5%,-1%,0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.8' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        'menu-in': {
          from: { opacity: '0', transform: 'translate3d(0,-12px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translate3d(0,16px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        drive: {
          from: { transform: 'translate3d(-30%,0,0)' },
          to: { transform: 'translate3d(130%,0,0)' },
        },
        road: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
      },
      animation: {
        kenburns: 'kenburns 9s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'menu-in': 'menu-in 0.25s cubic-bezier(0.16,1,0.3,1) both',
        road: 'road 1.6s linear infinite',
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  // hover: styles only on devices with a real pointer, so taps on phones/tablets don't leave menus stuck "hovered".
  future: { hoverOnlyWhenSupported: true },
  plugins: [],
};

export default config;

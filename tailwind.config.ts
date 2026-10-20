import type { Config } from 'tailwindcss';

/**
 * Brand tokens from the Diesel Dynamix brief (section 3).
 * `orange-ink` and `green-ink` are darker variants for text on light
 * backgrounds, where the base orange/green fail WCAG AA contrast.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1240px' },
    },
    extend: {
      colors: {
        charcoal: '#16181D',
        steel: { DEFAULT: '#2A2E36', light: '#3A3F49' },
        offwhite: '#F5F6F8',
        ink: '#111318',
        muted: { DEFAULT: '#4A5160', dark: '#A8AFBD' },
        orange: { DEFAULT: '#FF6B1A', deep: '#E2550A', ink: '#B8430A' },
        green: { DEFAULT: '#1E9E5A', ink: '#15703F' },
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
      maxWidth: { prose: '68ch' },
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
      },
      animation: {
        kenburns: 'kenburns 9s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        road: 'road 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

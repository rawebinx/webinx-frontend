import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // WebinX brand
        'wx-teal':       'var(--wx-teal)',
        'wx-teal-light': 'var(--wx-teal-light)',
        'wx-teal-pale':  'var(--wx-teal-pale)',
        'wx-gold':       'var(--wx-gold)',
        'wx-gold-pale':  'var(--wx-gold-pale)',
        'wx-ink':        'var(--wx-ink)',
        'wx-muted':      'var(--wx-muted)',
        'wx-surface':    'var(--wx-surface)',
        'wx-border':     'var(--wx-border)',
        // Sectors
        'sector-ai':         '#6366f1',
        'sector-technology': '#3b82f6',
        'sector-finance':    '#10b981',
        'sector-marketing':  '#f97316',
        'sector-startup':    '#8b5cf6',
        'sector-hr':         '#f43f5e',
        'sector-healthcare': '#14b8a6',
        'sector-education':  '#f59e0b',
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm:   'var(--shadow-sm)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        gold: 'var(--shadow-gold)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        shimmer:   'shimmer 1.4s ease infinite',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;

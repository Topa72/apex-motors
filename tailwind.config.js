/** @type {import('tailwindcss').Config} */
const token = (name) => `hsl(var(--${name}-hsl) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'apex-black': '#12141a',
        'apex-blue': '#0a90ff',
        'apex-green': '#2bb673',
        background: token('background'),
        foreground: token('foreground'),
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
        },
        'muted-foreground': token('muted-foreground'),
        border: token('border'),
        card: {
          DEFAULT: token('card'),
          elevated: token('card-elevated'),
        },
        success: token('success'),
        footer: token('footer'),
      },
      maxWidth: {
        site: '1320px',
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};

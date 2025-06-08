/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Colores principales de FERREMAS
          ferremas: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
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
          secondary: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          info: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          'xl': '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          '4xl': '2rem',
        },
        boxShadow: {
          'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
          'none': 'none',
          'ferremas': '0 10px 40px rgba(14, 165, 233, 0.15)',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-out': 'fadeOut 0.5s ease-in-out',
          'slide-in': 'slideIn 0.3s ease-out',
          'slide-out': 'slideOut 0.3s ease-in',
          'bounce-gentle': 'bounceGentle 2s infinite',
          'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'wiggle': 'wiggle 1s ease-in-out infinite',
          'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeOut: {
            '0%': { opacity: '1' },
            '100%': { opacity: '0' },
          },
          slideIn: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(0)' },
          },
          slideOut: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' },
          },
          bounceGentle: {
            '0%, 100%': { transform: 'translateY(-5%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
            '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
          },
          pulseSoft: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '.8' },
          },
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
        screens: {
          'xs': '475px',
          '3xl': '1600px',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      function({ addUtilities, addComponents, theme }) {
        addUtilities({
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
          '.scrollbar-default': {
            '-ms-overflow-style': 'auto',
            'scrollbar-width': 'auto',
            '&::-webkit-scrollbar': {
              display: 'block'
            }
          },
        });
        
        addComponents({
          '.btn': {
            padding: theme('spacing.2') + ' ' + theme('spacing.4'),
            borderRadius: theme('borderRadius.md'),
            fontWeight: theme('fontWeight.medium'),
            fontSize: theme('fontSize.sm'),
            lineHeight: theme('lineHeight.5'),
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid transparent',
            '&:disabled': {
              opacity: '0.5',
              cursor: 'not-allowed',
            },
          },
          '.btn-primary': {
            backgroundColor: theme('colors.primary.600'),
            color: theme('colors.white'),
            '&:hover': {
              backgroundColor: theme('colors.primary.700'),
            },
            '&:focus': {
              '--tw-ring-color': theme('colors.primary.500'),
              '--tw-ring-offset-width': '2px',
              '--tw-ring-width': '2px',
            },
          },
          '.btn-secondary': {
            backgroundColor: theme('colors.secondary.100'),
            color: theme('colors.secondary.700'),
            '&:hover': {
              backgroundColor: theme('colors.secondary.200'),
            },
          },
          '.btn-success': {
            backgroundColor: theme('colors.success.600'),
            color: theme('colors.white'),
            '&:hover': {
              backgroundColor: theme('colors.success.700'),
            },
          },
          '.btn-warning': {
            backgroundColor: theme('colors.warning.500'),
            color: theme('colors.white'),
            '&:hover': {
              backgroundColor: theme('colors.warning.600'),
            },
          },
          '.btn-error': {
            backgroundColor: theme('colors.error.600'),
            color: theme('colors.white'),
            '&:hover': {
              backgroundColor: theme('colors.error.700'),
            },
          },
          '.card': {
            backgroundColor: theme('colors.white'),
            borderRadius: theme('borderRadius.lg'),
            boxShadow: theme('boxShadow.md'),
            padding: theme('spacing.6'),
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: theme('boxShadow.lg'),
              transform: 'translateY(-2px)',
            },
          },
          '.glass': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        });
      },
    ],
  };
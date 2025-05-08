/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff', // Main primary color
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },

        // Secondary colors
        secondary: {
          50: '#f0f5ff',
          100: '#d6e4ff',
          200: '#adc6ff',
          300: '#85a5ff',
          400: '#597ef7',
          500: '#2f54eb', // Main secondary color
          600: '#1d39c4',
          700: '#10239e',
          800: '#061178',
          900: '#030852',
        },

        // Success colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Main success color
          700: '#047857',
        },

        // Warning colors
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b', // Main warning color
          700: '#b45309',
        },

        // Error colors
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444', // Main error color
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

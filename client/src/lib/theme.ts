export const theme = {
  colors: {
    primary: {
      50: '#f0f7ff',
      100: '#e0eefe',
      200: '#b9ddfc',
      300: '#7cc2fa',
      400: '#36a3f5',
      500: '#0c89e5',
      600: '#006cc4',
      700: '#0056a0',
      800: '#004884',
      900: '#043c6d'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87'
    },
    neutral: {
      50: '#f7f7f8',
      100: '#efeff2',
      200: '#dcdce3',
      300: '#b9bac8',
      400: '#8f91a5',
      500: '#6d6f87',
      600: '#545570',
      700: '#43435b',
      800: '#38384c',
      900: '#313142'
    },
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#EF4444',
    calm: '#93C5FD'
  },
  fonts: {
    sans: ['Inter', 'sans-serif'],
    display: ['Nunito', 'sans-serif']
  }
};

export type ThemeColors = typeof theme.colors;

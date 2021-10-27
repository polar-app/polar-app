import { themes } from '@storybook/theming';
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    current: 'light',

    // Override the default dark theme
    dark: { ...themes.dark, appBg: '#c6c6c6' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' }
  }
}


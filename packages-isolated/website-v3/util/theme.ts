import '@emotion/react'

const SPACING_BASE = 8;

export const THEME = {
    spacing: (x: number) =>  Math.floor(x * SPACING_BASE),
    palette: {
        primary: '#070F21',
        accent: (angle: number) => `linear-gradient(${angle}deg, #C5FCD6, #38E8A9)`,
        divider: '#CED8EF',
        background: {
            default: '#FAFAFA',
        },
        text: {
            normal: {
                primary: '#1A2530',
                secondary: '#374554',
                hint: 'rgba(5, 10, 22, 0.3)',
            },
            reversed: {
                primary: '#FFF',
                secondary: '#F1F1F1',
                hint: 'rgba(241, 241, 241, 0.6)',
            },
        },
        buttons: {
            hover: '#CED8EF',
            disabled: '#E7E9ED',
            link: '#B5C3E2',
        }
    }
};

export type CustomTheme = typeof THEME;

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}

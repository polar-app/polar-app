import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {css, Global, ThemeProvider} from '@emotion/react';
import {type CustomTheme, THEME} from '../util/theme';

const GLOBAL_STYLES = (theme: CustomTheme) => css`
    a {
        transition: color 150ms ease-out;
    }

    a:hover, a:active, a:visited {
        color: ${theme.palette.buttons.link};
    }
`;

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={THEME}>
            <Global styles={GLOBAL_STYLES} />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;

import {DarkModeScrollbars} from "../../../../../web/js/mui/css/DarkModeScrollbars";
import useTheme from "@material-ui/core/styles/useTheme";
import blue from '@material-ui/core/colors/blue';

export function useCSS() {

    const theme = useTheme();

    const darkModeScrollbars = theme.palette.type === 'dark' ?
        DarkModeScrollbars.createCSS() :
        {};

    const color = theme.palette.type === 'dark' ? 'rgb(217, 217, 217)' : theme.palette.text.primary;

    const baseColorStyles = {
        'color': `${color}`,
        'background-color': `${theme.palette.background.default}`,
    };

    const paddingStyles = {
        "padding-top": "10px",
        "padding-bottom": "10px",
        "padding-left": "10px",
        "padding-right": "10px",
        "padding": "10px",
    }

    return {

        ...darkModeScrollbars,
        'body, html': {
            ...baseColorStyles,
            'font-family': `${theme.typography.fontFamily} !important`,
            'padding': '0px',
            'padding-bottom': '5px !important',
        },

        'body :not(.polar-ui)': {
            ...baseColorStyles,
        },
        'body': {
            'margin': '5px',
            ...paddingStyles
        },
        'html': {
            'max-width': '800px !important',
            'margin-left': 'auto !important',
            'margin-right': 'auto !important',
            'margin-bottom': '5px !important',
            ...paddingStyles
        },
        'h1, h2, h3': {
            'color': `${theme.palette.text.primary}`
        },

        'header h2': {

        },

        'header > figure': {
            margin: '0px',
            display: 'flex'
        },

        'header > figure > img': {
            // height: '100%',
            // width: '100%',
            // 'object-fit': 'contain'
            'margin-left': 'auto',
            'margin-right': 'auto',
            'max-height': '100% !important',
            'max-width': '100% !important',
        },

        "a:link": {
            color: blue[300],
        },
        "a:visited": {
            color: blue[600],
        },
        "a:hover": {
            color: blue[400],
        },
        "a:active": {
            color: blue[500],
        },

    };

}

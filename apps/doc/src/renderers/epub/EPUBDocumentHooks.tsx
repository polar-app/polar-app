import React from 'react';
import ScrollbarColors from "../../../../../web/js/mui/css/ScrollbarColors";
import useTheme from "@material-ui/core/styles/useTheme";
import blue from '@material-ui/core/colors/blue';
import { StringBuffer } from "polar-shared/src/util/StringBuffer";

export namespace StylesheetMaps {

    export function toStylesheetURL(stylesheetMap: IStylesheetMap) {
        const cssStr = StylesheetMaps.toString(stylesheetMap);
        const blob = new Blob([cssStr], {type: 'text/css'});
        return URL.createObjectURL(blob);
    }

    export function toString(stylesheetMap: IStylesheetMap) {

        const buff = new StringBuffer();

        for (const rule of Object.keys(stylesheetMap)) {

            const rules = stylesheetMap[rule];

            buff.append(`${rule} {\n`);

            for (const style of Object.entries(rules)) {
                buff.append(`    ${style[0]}: ${style[1]};\n`);
            }

            buff.append(`}\n`);

        }

        return buff.toString();

    }

}

export interface IStylesheetMapRules {
    [key: string]: string;
}

/**
 * Regular/standard stylesheet map without react property camelCase keys.
 */
interface IStylesheetMap {
    [key: string]: IStylesheetMapRules;
}

export function useStylesheetURL() {
    const stylesheetMap = useCSS();
    return React.useMemo(() => StylesheetMaps.toStylesheetURL(stylesheetMap),
                         [stylesheetMap]);
}

export function useCSS(): IStylesheetMap {
    const theme = useTheme();

    const scrollBars = ScrollbarColors.createCSS(theme);

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

        ...scrollBars,
        'body, html': {
            'background-color': `${theme.palette.background.default}`,
            'font-family': `${theme.typography.fontFamily} !important`,
            'padding': '0px',
            'padding-bottom': '5px !important',
        },

        'body :not(.polar-ui)': {
            ...baseColorStyles,
        },
        'body': {
            'margin': '5px',
            'min-height': 'calc(100vh - 20px)',
            ...paddingStyles,
            // TODO: needed for a fixed width layout.
            // 'position': 'relative'
        },
        'html': {
            // TODO: needed for a fixed width layout.
            'background-color': `${theme.palette.background.default}`,
            // TODO: needed for a fixed width layout.
            // 'max-width': '800px !important',
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
            'overflow': 'hidden'
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

import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {useTheme, lighten} from "@material-ui/core/styles";
import grey from '@material-ui/core/colors/grey'
import clsx from 'clsx';

export type Elevation = 0 | 1 | 2 | 3 | 4;

export type BackgroundColor = string;

export interface IElevation {
    readonly default: BackgroundColor;
    readonly highlighted: BackgroundColor;
}

export interface IElevations {
    readonly 0: IElevation;
    readonly 1: IElevation;
    readonly 2: IElevation;
    readonly 3: IElevation;
}


export function useElevations(): IElevations {
    const theme = useTheme();

    return {
        0: {
            default: theme.palette.background.default,
            highlighted: lighten(theme.palette.background.default)
        },
        1: {
            default: theme.palette.background.default,
            highlighted: lighten(theme.palette.background.default)
        },
        2: {
            default: theme.palette.background.default,
            highlighted: lighten(theme.palette.background.default)
        },
        3: {
            default: theme.palette.background.default,
            highlighted: lighten(theme.palette.background.default)
        },
    }
}


export function useElevationBackground(elevation: Elevation) {

    // this would be better as a CSS style.

    const theme = useTheme();

    if (theme.palette.type === 'dark') {

        switch(elevation) {

            case 0:
                return theme.palette.background.default
            case 1:
                return grey[800];
            case 2:
                return grey[700];
            case 3:
                return grey[600];
            case 4:
                return grey[500];

        }

    } else {

        switch(elevation) {

            case 0:
                return theme.palette.background.default
            case 1:
                return grey[300];
            case 2:
                return grey[400];
            case 3:
                return grey[500];
            case 4:
                return grey[600];

        }

    }

}

interface IProps {
    readonly elevation: Elevation;
    readonly children?: React.ReactElement;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

/**
 * Basic component to set the background color to the selected color.
 *
 * https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js
 */
export const MUIElevation = deepMemo((props: IProps) => {

    const background = useElevationBackground(props.elevation);

    return (
        <div className={clsx(['mui-elevation', props.className])}
             style={{
                 background,
                 ...props.style
             }}>

            {props.children}

        </div>
    );
});

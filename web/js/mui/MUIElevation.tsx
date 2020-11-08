import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {useTheme, lighten} from "@material-ui/core/styles";
import grey from '@material-ui/core/colors/grey'
import clsx from 'clsx';

export type Elevation = 0 | 1 | 2 | 3;

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
            default: 'rgb(66,66,66)',
            highlighted: 'rgb(79,79,79)'
        },
        2: {
            default: 'rgb(75,75,75)',
            highlighted: 'rgb(94,94,94)'
        },
        3: {
            default: 'rgb(83,83,83)',
            highlighted: 'rgb(96,96,96)'
        },
    }
}



export function useElevationBackground(elevation: Elevation) {

    const elevations = useElevations();
    return elevations[elevation];

}

export function useElevationBackground2(elevation: Elevation) {

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

        }

    }

}

interface IProps {
    readonly elevation: Elevation;
    readonly children?: React.ReactElement;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly highlighted?: boolean;
}

/**
 * Basic component to set the background color to the selected color.
 *
 * https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js
 */
export const MUIElevation = deepMemo((props: IProps) => {

    const elevation = useElevationBackground(props.elevation);
    const background = props.highlighted ? elevation.default : elevation.highlighted;

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

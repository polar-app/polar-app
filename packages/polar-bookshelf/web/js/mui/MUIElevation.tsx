import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {useTheme, lighten} from "@material-ui/core/styles";
import grey from '@material-ui/core/colors/grey'
import clsx from 'clsx';

export type Elevation = 0 | 1 | 2;

export type BackgroundColor = string;

export interface IElevation {
    readonly default: BackgroundColor;
    readonly highlighted: BackgroundColor;
}

export interface IElevations {
    readonly 0: IElevation;
    readonly 1: IElevation;
    readonly 2: IElevation;
    // readonly 3: IElevation;
}


export function useElevations(): IElevations {
    const theme = useTheme();

    // TODO: light mode ...

    return {
        0: {
            default: theme.palette.background.default,
            highlighted: '#2b2b2b'
        },
        1: {
            default: '#262626',
            highlighted: '#363636'
        },
        2: {
            default: theme.palette.background.paper,
            highlighted: '#3b3b3b'
        }
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

        }

    } else {

        switch(elevation) {

            case 0:
                return theme.palette.background.default
            case 1:
                return grey[300];
            case 2:
                return grey[400];

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
export const MUIElevation = deepMemo(function MUIElevation(props: IProps) {

    const elevation = useElevationBackground(props.elevation);
    const backgroundColor = props.highlighted ? elevation.highlighted : elevation.default;

    return (
        <div className={clsx(['mui-elevation', props.className])}
             style={{
                 backgroundColor,
                 ...props.style
             }}>

            {props.children}

        </div>
    );
});

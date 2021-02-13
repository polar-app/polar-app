import * as React from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";

export function IndeterminateProgressBar() {

    return (
        <LinearProgress/>
    );
}

export interface IProps {
    readonly style?: React.CSSProperties;
}

export interface IState {
}

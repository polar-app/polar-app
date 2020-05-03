import * as React from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";

export class IndeterminateProgressBar extends React.PureComponent<IProps, IState> {

    public render() {

        return (
            <LinearProgress />
        );
    }

}

export interface IProps {
    readonly style?: React.CSSProperties;
}

export interface IState {
}

import * as React from 'react';

export class IndeterminateProgressBar extends React.PureComponent<IProps, IState> {

    public render() {

        return (
            <div className="polar-indeterminate-progress" style={this.props.style}/>
        );
    }

}

export interface IProps {
    readonly style?: React.CSSProperties;
}

export interface IState {
}

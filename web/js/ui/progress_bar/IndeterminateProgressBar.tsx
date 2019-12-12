import * as React from 'react';

export class IndeterminateProgressBar extends React.PureComponent<IProps, IState> {

    public render() {

        const style: React.CSSProperties = {
            height: this.props.height || '4px',
        };

        return (
            <div className="progress-indeterminate-slider" style={style}>
                <div className="progress-indeterminate-line"
                     />

                <div className="progress-indeterminate-subline progress-indeterminate-inc"
                     />

                <div className="progress-indeterminate-subline progress-indeterminate-dec"
                     />
            </div>
        );
    }

}

export interface IProps {
    readonly height?: string | number;
}

export interface IState {
}

import * as React from 'react';

export class StatBox extends React.Component<IProps, IState> {

    public render() {

        return <div className="border rounded p-2 pb-4"
                    style={this.props.style || {}}>

            {this.props.children}

        </div>;

    }
}

export interface IProps {
    readonly style?: React.CSSProperties;
}

export interface IState {

}

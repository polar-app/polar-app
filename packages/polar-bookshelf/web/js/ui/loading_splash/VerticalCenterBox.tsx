import * as React from 'react';
import {LoadingMessages} from "./LoadingMessages";

export class VerticalCenterBox extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (
            <div id={this.props.id}
                 style={{
                     display: 'flex',
                     position: 'absolute',
                     left: 0,
                     width: '100%',
                     top: '50%',
                     zIndex: 1000000
                 }}>

                <div style={{
                        margin: 'auto',
                        paddingTop: this.props.paddingTop
                    }}>
                    {this.props.children}
                </div>

            </div>
        );
    }

}

export interface IProps {
    readonly id?: string;
    readonly paddingTop?: string;
}

export interface IState {
}

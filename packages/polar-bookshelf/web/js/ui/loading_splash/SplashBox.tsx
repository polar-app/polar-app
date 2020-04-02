import * as React from 'react';
import {LoadingMessages} from "./LoadingMessages";

export class SplashBox extends React.Component<IProps, IState> {

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
                     top: 0,
                     width: '100vw',
                     height: '100vh',
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

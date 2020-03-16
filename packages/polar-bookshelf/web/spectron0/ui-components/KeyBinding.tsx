import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';

export class KeyBinding extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        return (

            <div>
                {this.props.children}
            </div>

        );

    }

}

export interface IProps {

}

interface IState {

}


import * as React from 'react';
import {Blackout} from "../blackout/Blackout";

export class BlackoutBox extends React.Component<IProps, IState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public componentWillMount(): void {
        Blackout.enable();
    }

    public componentWillUnmount(): void {
        Blackout.disable();
    }

    public render() {
        return this.props.children;
    }

}

interface IProps {
}

interface IState {

}

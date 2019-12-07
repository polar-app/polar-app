import * as React from 'react';

export class Tracer extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        console.log("tracer: constructor of trace");

    }

    public componentDidMount(): void {
        console.log("tracer: trace componentDidMount " + this.props.id);
    }

    public componentWillUnmount(): void {
        console.log("tracer: trace componentWillUnmount: " + this.props.id);
    }

    public render() {
        return <div id={this.props.id}>
            {this.props.id}
        </div>;
    }

}


interface IProps {
    readonly id: string;
}

interface IState {
}



import * as React from 'react';
import {Button} from "reactstrap";

export class FakeComponent1 extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.updateTitle = this.updateTitle.bind(this);

        this.state = {
            title: 'FakeComponent1'
        };
    }

    public render() {

        console.log("FakeComponent1: render");

        return <div>

            {this.state.title}:

            <Button onClick={() => this.updateTitle()}>
                Click Me
            </Button>

        </div>;
    }
    private updateTitle() {
        this.setState({title: "FakeComponent1: " + new Date().toISOString()})
    }

}


interface IProps {
}

interface IState {
    readonly title: string;
}



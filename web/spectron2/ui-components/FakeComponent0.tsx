import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {FakeComponent1} from './FakeComponent1';

export class FakeComponent0 extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.updateTitle = this.updateTitle.bind(this);

        this.state = {
            title: "FakeComponent0"
        };

    }

    public render() {

        console.log("FakeComponent0: render");

        return <div>

            {this.state.title}:

            <Button onClick={() => this.updateTitle()}>
                Click Me
            </Button>

            <FakeComponent1/>

        </div>;
    }

    private updateTitle() {
        this.setState({title: "FakeComponent0: " + ": " + new Date().toISOString()});
    }

}


interface IProps {
}

interface IState {
    readonly title: string;
}



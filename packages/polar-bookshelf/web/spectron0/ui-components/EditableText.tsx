import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import Popover from 'reactstrap/lib/Popover';
import PopoverBody from 'reactstrap/lib/PopoverBody';
import {Button, Input} from "reactstrap";

export class EditableText extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.toggle = this.toggle.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);

        this.state = {
            editing: false
        };

    }

    public render() {

        // TODO: if we click outside of the input it should stop and/or be accepted or at least
        // obviously still being edited.

        // FIXME: the escape key finding isn't active when this component is active...

        if (this.state.editing) {
            return <div>
                <input type="text"
                       className="p-0"
                       onKeyDown={event => this.onKeyDown(event)}
                       defaultValue={this.props.value}/>
            </div>;
        } else {

            return (

                <div onDoubleClick={() => this.toggle()}
                     style={{
                         padding: '2px'
                     }}>
                    {this.props.value}
                </div>

            );

        }

    }

    private onKeyDown(event: React.KeyboardEvent<HTMLElement>) {

        if (event.key === "Escape") {
            this.onCancel();
        }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.onDone();
        }

    }

    private onCancel() {
        this.props.onCancel();
        this.toggle();
    }

    private onDone() {
        this.toggle();
    }

    private toggle() {
        console.log("FIXME: toggling");
        this.setState({editing: ! this.state.editing});
    }

}

interface IProps {
    readonly value: string;
    readonly onDone: (value: string) => void;
    readonly onCancel: () => void;
}

interface IState {

    readonly editing?: boolean;

}


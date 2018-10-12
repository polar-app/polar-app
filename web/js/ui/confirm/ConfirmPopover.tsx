/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';

export class ConfirmButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.onCancel = this.onCancel.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            popoverOpen: false
        };

    }

    public render() {
        return (

            <Popover placement={this.props.placement || 'bottom'}
                     isOpen={this.state.popoverOpen}
                     target={this.props.target}
                     toggle={this.toggle}>

                <PopoverBody>

                    <div className="w-100 text-center lead p-1">
                        {this.props.prompt}
                    </div>

                    <Button color="secondary"
                            size="sm"
                            className="m-1"
                            onClick={() => this.onCancel()}>Cancel</Button>

                    <Button color="primary"
                            size="sm"
                            className="m-1"
                            onClick={() => this.props.onConfirm()}>Confirm</Button>

                </PopoverBody>

            </Popover>
        );
    }

    private onCancel() {
        this.setState({
            popoverOpen: false
        });
    }

    private toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

}

interface IProps {
    target: string;
    prompt: string;
    placement?: Popper.Placement;
    // onCancel: () => void;
    onConfirm: () => void;
}

interface IState {
    popoverOpen: boolean;
}

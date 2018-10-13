/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';

export class ConfirmPopover extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {
        return (

            <Popover placement={this.props.placement || 'bottom'}
                     isOpen={this.props.open}
                     target={this.props.target}
                     className="confirm-popover">

                <PopoverBody className="text-center">

                    <div className="w-100 lead p-1">
                        {this.props.prompt}
                    </div>

                    <Button color="secondary"
                            size="sm"
                            className="m-1"
                            onClick={() => this.props.onCancel()}>Cancel</Button>

                    <Button color="primary"
                            size="sm"
                            className="m-1"
                            onClick={() => this.props.onConfirm()}>Confirm</Button>

                </PopoverBody>

            </Popover>
        );
    }

}

interface IProps {
    open: boolean;
    target: string;
    prompt: string;
    placement?: Popper.Placement;
    onCancel: () => void;
    onConfirm: () => void;
}

interface IState {
    open: boolean;
}

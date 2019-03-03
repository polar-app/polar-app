/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Button, Popover, PopoverBody} from 'reactstrap';
import Popper from 'popper.js';
import {IStyleMap} from '../../react/IStyleMap';

class Styles {

    public static title: React.CSSProperties = {
        fontSize: "20px",
        fontWeight: "bold"
    };

    public static subtitle: React.CSSProperties = {
        fontSize: "14px"
    };

    public static button: React.CSSProperties = {
        fontSize: "14px"
    };

    public static popover: React.CSSProperties = {
        // TOD: width isn't working right now.
    };

}

export class ConfirmPrompt extends React.Component<ConfirmPromptProps, IState> {

    constructor(props: ConfirmPromptProps) {
        super(props);

    }

    public render() {

        return (

            <Popover placement={this.props.placement || 'bottom'}
                     isOpen={this.props.open}
                     target={this.props.target}
                     className="confirm-prompt"
                     style={Styles.popover}>

                <PopoverBody className="text-center">

                    <div className="w-100 p-1" style={Styles.title}>
                        {this.props.title}
                    </div>

                    <div className="w-100 p-1 muted" style={Styles.subtitle}>
                        {this.props.subtitle || ""}
                    </div>

                    <Button color="secondary"
                            style={Styles.button}
                            size="sm"
                            className="m-1"
                            onClick={() => this.props.onCancel()}>Cancel</Button>

                    <Button color="primary"
                            style={Styles.button}
                            size="sm"
                            className="m-1"
                            onClick={() => this.props.onConfirm()}>Confirm</Button>

                </PopoverBody>

            </Popover>
        );
    }

}

export interface ConfirmPromptProps {
    open?: boolean;
    target: string;
    title: string;
    subtitle?: string;
    placement?: Popper.Placement;
    onCancel: () => void;
    onConfirm: () => void;
}

export interface IState {
    open: boolean;
}


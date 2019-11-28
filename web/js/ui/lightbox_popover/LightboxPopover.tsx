/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react';
import {Popover} from 'reactstrap';
import Popper from 'popper.js';
import {BlackoutBox} from "../util/BlackoutBox";

/**
 * Popover that functions like a normal popover but uses a lightbox to highlight
 * the popover being selected.
 */
export class LightboxPopover extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

    }

    public render() {

        return (

            <BlackoutBox>
                <Popover placement={this.props.placement || 'bottom'}
                         isOpen={this.props.open}
                         className={this.props.className}
                         target={this.props.target}
                         trigger="legacy"
                         style={this.props.style}>

                    {this.props.children}

                </Popover>
            </BlackoutBox>

        );
    }

}

interface IProps {
    target: string;
    open: boolean;
    placement?: Popper.Placement;
    className?: string;
    style?: React.CSSProperties;
}

interface IState {

}


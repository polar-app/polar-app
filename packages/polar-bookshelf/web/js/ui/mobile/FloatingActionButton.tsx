import * as React from 'react';
import {ActionButton} from "./ActionButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {FloatingAction} from "./FloatingAction";

export class FloatingActionButton extends React.Component<IProps> {

    public render() {
        
        const onClick = this.props.onClick || NULL_FUNCTION;

        return (

            <FloatingAction style={this.props.style}>

                <ActionButton icon={this.props.icon}
                              text={this.props.text}
                              color={this.props.color}
                              onClick={onClick}/>

            </FloatingAction>

        );

    }

}

export type CSSPadding = string | number;

export interface FloatingStyle {
    readonly marginRight?: CSSPadding;
    readonly marginBottom?: CSSPadding;
}

export interface IProps {

    readonly icon: string;
    readonly text?: string;

    /**
     * Allow the user to specify their own CSS padding.
     */
    readonly style?: FloatingStyle;

    readonly onClick?: () => void;

    readonly color?: 'success' | 'primary';

}

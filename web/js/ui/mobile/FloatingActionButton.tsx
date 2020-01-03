import * as React from 'react';
import {ActionButton} from "./ActionButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export class FloatingActionButton extends React.Component<IProps> {

    public render() {

        const style = {
            marginRight: this.props.style?.marginRight || '2em',
            marginBottom: this.props.style?.marginBottom || '2em',
        };

        const onClick = this.props.onClick || NULL_FUNCTION;

        return (

            <div className="floating-action-button"
                 style={{
                     position: "absolute",
                     right: 0,
                     bottom: 0,
                     zIndex: 100000,
                     ...style
                 }}>

                <ActionButton icon={this.props.icon}
                              text={this.props.text}
                              onClick={onClick}/>

            </div>

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

}

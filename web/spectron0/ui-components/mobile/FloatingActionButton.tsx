import * as React from 'react';
import {ActionButton} from "./ActionButton";

export class FloatingActionButton extends React.Component<IProps> {

    public render() {

        const style = {
            paddingRight: this.props.style?.paddingRight || '2em',
            paddingBottom: this.props.style?.paddingBottom || '2em',
        };

        return (

            <div style={{
                     position: "absolute",
                     right: 0,
                     bottom: 0,
                     ...style
                 }}>
                <ActionButton onClick={() => this.props.onClick()}/>
            </div>

        );

    }

}

export type CSSPadding = string | number;

export interface FloatingStyle {
    readonly paddingRight?: CSSPadding;
    readonly paddingBottom?: CSSPadding;
}

export interface IProps {

    /**
     * Allow the user to specify their own CSS padding.
     */
    readonly style?: FloatingStyle;

    readonly onClick: () => void;

}

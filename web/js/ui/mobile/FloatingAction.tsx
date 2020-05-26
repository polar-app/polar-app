import * as React from 'react';

/**
 * @Deprecated
 */
export const FloatingAction = (props: IProps) => {

    const style = {
        marginRight: props.style?.marginRight || '2em',
        marginBottom: props.style?.marginBottom || '2em',
    };

    return (

        <div className="floating-action"
             style={{
                 position: "absolute",
                 right: 0,
                 bottom: 0,
                 zIndex: 100000,
                 ...style
             }}>

            {props.children}

        </div>

    );

};

export type CSSPadding = string | number;

export interface FloatingStyle {
    readonly marginRight?: CSSPadding;
    readonly marginBottom?: CSSPadding;
}

export interface IProps {

    /**
     * Allow the user to specify their own CSS padding.
     */
    readonly style?: FloatingStyle;

    readonly children: any;

}

import * as React from 'react';

export interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}

export const StatBox = (props: IProps) => {

    return (
        <div className=""
             style={props.style || {}}>

            {props.children}

        </div>
    );

};

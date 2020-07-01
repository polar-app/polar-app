import * as React from 'react';

export interface IProps {
    readonly style?: React.CSSProperties;
    readonly children: React.ReactElement;
}

export const StatBox = (props: IProps) => {

    return (
        <div className="p-1"
             style={props.style || {}}>

            {props.children}

        </div>
    );

};

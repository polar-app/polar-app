import * as React from 'react';


export interface IProps {
    readonly id?: string;
    readonly paddingTop?: string;
    readonly children: React.ReactElement;
}

export function SplashBox(props: IProps) {

    return (
        <div id={props.id}
             style={{
                 display: 'flex',
                 position: 'absolute',
                 left: 0,
                 top: 0,
                 width: '100vw',
                 height: '100vh',
                 zIndex: 1000000
             }}>

            <div style={{
                margin: 'auto',
                paddingTop: props.paddingTop
            }}>
                {props.children}
            </div>

        </div>
    );
}

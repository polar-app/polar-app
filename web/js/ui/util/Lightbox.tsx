import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface IProps  {
    readonly children: any;
    readonly container?: string;
}

const LightboxBody = (props: IProps) => (
    <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        display: 'flex'
    }}>

        <div style={{
            margin: "auto",
        }}>

            {props.children}

        </div>

    </div>
);

export const Lightbox = (props: IProps) => {

    if (props.container) {

        const element = document.querySelector(props.container)!;

        return ReactDOM.createPortal(
            <LightboxBody {...props}/>,
            element
        );

    }

    return (
        <LightboxBody {...props}/>
    );

};

export const Lightbox2 = (props: any) => (
    <div>
        {props.children}
    </div>
);


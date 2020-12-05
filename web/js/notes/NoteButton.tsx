import * as React from 'react';

interface IProps {
    readonly children: JSX.Element;
}

export const NoteButton = React.memo(function NoteButton(props: IProps) {

    return (
        <div style={{
                 display: 'inline-block',
                 borderRadius: '1em',
                 backgroundColor: 'red',
                 width: '1em',
                 height: '1em',
                 lineHeight: '1em',
                 cursor: 'pointer'
             }}>
            <div style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     lineHeight: '1em',
                 }}>

                {props.children}

            </div>
        </div>
    );
    
});
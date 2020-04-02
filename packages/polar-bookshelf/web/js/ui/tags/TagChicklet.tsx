import * as React from 'react';

interface IProps {
    children: JSX.Element | string;
}

export const TagChicklet = (props: IProps) => (

    <div className="rounded border"
         style={{
             backgroundColor: 'var(--grey100)',
             color: 'hsl(0,0%,20%)',
             fontSize: '12px',
             padding: '0.2em',
             paddingLeft: '0.3em',
             paddingRight: '0.3em',
             userSelect: 'none'
         }}>
        {props.children}
    </div>

);

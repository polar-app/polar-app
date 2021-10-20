import * as React from 'react';

interface IProps {
    readonly children: string;
}

export default function StatTitle(props: IProps) {

    return (

        <h2>{props.children}</h2>

    );
}


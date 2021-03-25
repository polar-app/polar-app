import React from 'react';
import {deepMemo} from "../../react/ReactUtils";

interface IProps {
    readonly side: 'left' | 'right';
    readonly color: string;
    readonly height: number;
    readonly onMouseDown: (event: React.MouseEvent) => void;
    readonly onMouseUp: (event: React.MouseEvent) => void;
}

export const VerticalLine = deepMemo(function VerticalLine(props: IProps) {

    const position = props.side === 'left' ? {left: '0px'} : {right: '0px'};

    const style: React.CSSProperties = {
        position: 'absolute',
        width: '5px',
        height: `${props.height}px`,
        backgroundColor: props.color,
        cursor: 'col-resize',
        ...position
    };

    return (
        <div style={style}
             draggable={false}
             onMouseDown={props.onMouseDown}
             onMouseUp={props.onMouseUp}>

        </div>
    )
})


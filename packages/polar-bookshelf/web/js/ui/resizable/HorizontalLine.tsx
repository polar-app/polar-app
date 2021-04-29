import React from 'react';
import {deepMemo} from "../../react/ReactUtils";

interface IProps {
    readonly side: 'top' | 'bottom';
    readonly color: string;
    readonly width: number;
    readonly onMouseDown: (event: React.MouseEvent) => void;
    readonly onMouseUp: (event: React.MouseEvent) => void;
}

export const HorizontalLine = deepMemo(function HorizontalLine(props: IProps) {

    const position = props.side === 'top' ? {top: '0px'} : {bottom: '0px'};

    const style: React.CSSProperties = {
        position: 'absolute',
        height: '5px',
        width: `${props.width}px`,
        backgroundColor: props.color,
        cursor: 'row-resize',
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


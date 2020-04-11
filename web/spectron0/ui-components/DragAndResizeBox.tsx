import {Rnd} from "react-rnd";
import * as React from "react";

interface IProps {

}

export function DragAndResizeBox() {

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto'
    };

    return (
        <Rnd
            default={{
                x: 10,
                y: 10,
                width: 320,
                height: 200,
            }}
            disableDragging={true}
            resizeHandleStyles={{
                bottom: resizeHandleStyle,
                bottomLeft: resizeHandleStyle,
                bottomRight: resizeHandleStyle,
                top: resizeHandleStyle,
                topLeft: resizeHandleStyle,
                topRight: resizeHandleStyle,
                left: resizeHandleStyle,
                right: resizeHandleStyle
            }}
            style={{
                backgroundColor: 'rgba(0, 0, 255, 0.6)',
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
                display: 'flex'
            }}>

        </Rnd>
    );

}

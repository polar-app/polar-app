import {Rnd} from "react-rnd";
import * as React from "react";
import {useState} from "react";

interface IProps {

}

interface IState {
    readonly active: boolean;
}

export function DragAndResizeBox() {

    const [state, setState] = useState<IState>({active: false});

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto'
    };

    const handleOnMouseOver = () => {
        console.log("FIXME: over");
        setState({active: true});
    };

    const handleOnMouseOut = () => {
        console.log("FIXME: out");
        setState({active: false});
    };

    // FIXME: we need to know the position of the box and we need to have
    // comment , delete , etc buttons, including the ability to change color
    // of the item.

    return (
        <Rnd
            default={{
                x: 10,
                y: 10,
                width: 320,
                height: 200,
            }}
            onMouseOver={() => handleOnMouseOver()}
            onMouseOut={() => handleOnMouseOut()}
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

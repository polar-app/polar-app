import {Rnd} from "react-rnd";
import * as React from "react";
import {DetailedHTMLProps, HTMLAttributes, useState} from "react";

interface ControlBarProps {
    readonly top: number;
    readonly left: number;
    readonly width: number;
}

const ControlBar = (props: ControlBarProps) => (
    <div style={{
             position: 'absolute',
             top: `calc(${props.top}px - 2.5em)`,
             left: props.left,
             width: props.width,
             height: '1.5em',
             display: 'flex',
             zIndex: 1,
         }}>

        <div className="ml-auto mr-auto">

            <div className="border rounded p-1 pl-2 pr-2"
                 style={{
                     backgroundColor: 'var(--grey100)'
                 }}>
                this is the control bar!
            </div>

        </div>

    </div>
);

interface IProps extends HTMLAttributes<HTMLDivElement> {

}

interface IState {
    readonly active: boolean;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export function ResizeBox(props: IProps) {

    const [state, setState] = useState<IState>({
        active: false,
        x: 10,
        y: 75,
        width: 300,
        height: 300
    });

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto'
    };

    const handleOnMouseOver = () => {
        setState({
            ...state,
            active: true
        });
    };

    const handleOnMouseOut = () => {
        setState({
            ...state,
            active: false
        });
    };

    // FIXME: we need to know the position of the box and we need to have
    // comment , delete , etc buttons, including the ability to change color
    // of the item.

    return (
        <>

            <ControlBar top={state.y} left={state.x} width={state.width}/>

            {/*{state.active &&*/}
            {/*    <ControlBar bottom={state.y} left={state.x} width={state.width}/>}*/}

            <Rnd
                size={{ width: state.width,  height: state.height }}
                position={{ x: state.x, y: state.y }}
                onMouseOver={() => handleOnMouseOver()}
                onMouseOut={() => handleOnMouseOut()}
                onDragStop={(e, d) => {
                    setState({
                        ...state,
                        x: d.x,
                        y: d.y
                    });
                }}
                onResizeStop={(e,
                               direction,
                               ref,
                               delta,
                               position) => {

                    const width = parseInt(ref.style.width);
                    const height = parseInt(ref.style.height);

                    setState({
                        ...state,
                        width,
                        height,
                        ...position,
                    });
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
        </>
    );

}

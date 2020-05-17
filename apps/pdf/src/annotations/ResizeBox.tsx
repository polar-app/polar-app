import {Rnd} from "react-rnd";
import * as React from "react";
import {useState} from "react";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly id?: string;
    readonly style?: React.CSSProperties;
    readonly className?: string;

    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;

    readonly onResized?: (resizeRect: ILTRect) => void;

    readonly onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

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
        x: props.left,
        y: props.top,
        width: props.width,
        height: props.height
    });

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto'
    };

    const handleOnMouseOver = React.useCallback(() => {
        setState({
            ...state,
            active: true
        });
    }, []);

    const handleOnMouseOut = React.useCallback(() => {
        setState({
            ...state,
            active: false
        });
    }, []);

    const handleResize = React.useCallback((state: IState) => {

        const onResized = props.onResized || NULL_FUNCTION

        onResized({
            left: state.x,
            top: state.y,
            width: state.width,
            height: state.height
        });

        setState(state);

    }, [])

    // FIXME: we need to know the position of the box and we need to have
    // comment , delete , etc buttons, including the ability to change color
    // of the item.

    return (
        <>

            {/*{state.active &&*/}
            {/*    <ControlBar bottom={state.y} left={state.x} width={state.width}/>}*/}

            <Rnd
                size={{
                    width: state.width,
                    height: state.height
                }}
                position={{ x: state.x, y: state.y }}
                onMouseOver={() => handleOnMouseOver()}
                onMouseOut={() => handleOnMouseOut()}
                onDragStop={(e, d) => {
                    handleResize({
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

                    handleResize({
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
                    ...props.style,
                    pointerEvents: 'none',
                }}>
                {/*<div onContextMenu={props.onContextMenu}*/}
                {/*     style={{*/}
                {/*         width: state.width,*/}
                {/*         height: state.height*/}
                {/*     }}>*/}

                {/*</div>*/}
            </Rnd>
        </>
    );

}

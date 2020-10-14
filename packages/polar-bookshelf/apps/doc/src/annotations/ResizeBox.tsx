import {HandleStyles, ResizeEnable, Rnd, ResizableDelta} from "react-rnd";
import {ResizeDirection} from "re-resizable";
import * as React from "react";
import {useState} from "react";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useWindowResizeEventListener} from "../../../../web/js/react/WindowHooks";
import {IPoint} from "../../../../web/js/Point";
import {IXYRect} from "polar-shared/src/util/rects/IXYRect";
import {useScrollIntoViewUsingLocation} from "./ScrollIntoViewUsingLocation";

interface IProps {
    readonly id?: string;
    readonly style?: React.CSSProperties;
    readonly resizeHandleStyle?: React.CSSProperties;

    readonly className?: string;

    readonly bounds?: string;

    readonly document?: Document;
    readonly window?: Window;

    /**
     * Used to compute the initial position of the resize box during initial
     * mount
     */
    readonly computePosition: () => ILTRect;

    readonly resizeHandleStyles?: HandleStyles;

    /**
     * Handle the box being resized, and we can then return a new rect that is
     * used to position it after the resize so we could 'snap' to some computed
     * box after the user re-sizes it manually.  We return undefined if no
     * mutation needs to be made.
     */
    readonly onResized?: (resizeRect: ILTRect, direction: ResizeDirection) => IXYRect | undefined;

    readonly onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

    readonly enableResizing?: ResizeEnable;

    readonly resizeAxis?: 'y'

}

interface IBox {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

interface IState extends IBox {
    readonly active: boolean;
}

function deriveStateFromInitialPosition(computeInitialPosition: () => ILTRect): IState {

    const initialPosition = computeInitialPosition();

    return {
        active: true,
        x: initialPosition.left,
        y: initialPosition.top,
        width: initialPosition.width,
        height: initialPosition.height
    };

}

function computeNewBox(box: IBox, direction: ResizeDirection, delta: ResizableDelta): IBox {

    if (direction.startsWith('left') || direction.startsWith('top')) {
        return {
            x: box.x - delta.width,
            width: box.width + delta.width,
            y: box.y - delta.height,
            height: box.height + delta.height
        };
    }

    if (direction.startsWith('right') || direction.startsWith('bottom')) {
        return {
            x: box.x,
            y: box.y,
            width: box.width + delta.width,
            height: box.height + delta.height
        };
    }

    throw new Error("unhandled direction: " + direction);

}

export const ResizeBox = deepMemo((props: IProps) => {

    const computeNewState = () => deriveStateFromInitialPosition(props.computePosition);

    const [state, setState] = useState<IState>(computeNewState);
    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    const rndRef = React.useRef<Rnd | null>(null);

    useWindowResizeEventListener(() => {
        setState(computeNewState());
    }, {win: props.window});

    const handleRndRef = React.useCallback((rnd: Rnd | null) => {
        rndRef.current = rnd;
        // now handle the scroll ref so that we can jump to the pagemark...
        scrollIntoViewRef(rndRef.current ? rndRef.current.getSelfElement() : null);
    }, []);

    const handleResize = React.useCallback((newState: IState,
                                            direction: ResizeDirection) => {

        function computeStateWithAxisHandling(): IState {

            if (props.resizeAxis === 'y') {
                return {
                    active: newState.active,
                    x: state.x,
                    y: newState.y,
                    width: state.width,
                    height: newState.height
                }
            }

            return newState;

        }

        newState = computeStateWithAxisHandling();

        setState(newState);

        try {

            // It's important to always catch exceptions here as if we don't
            // then react-rnd breaks.

            const onResized = props.onResized || NULL_FUNCTION

            const newPosition = onResized({
                left: newState.x,
                top: newState.y,
                width: newState.width,
                height: newState.height
            }, direction);

            if (newPosition) {
                setState({...state, ...newPosition});
            }

        } catch (e) {
            console.error(e);
        }

    }, [])

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto',
        ...(props.resizeHandleStyle || {})
    };

    const handleOnMouseOver = () => {
        setState({
            ...state,
            active: true
        });
    }

    const handleOnMouseOut = () => {
        setState({
            ...state,
            active: false
        });
    }

    const dataProps = Dictionaries.filter<any>(props, key => key.startsWith('data-'));

    const outlineSize = 5
    const outlineSizePX = `${outlineSize}px`;

    const resizeStyles = {
        vertical: {
            width: outlineSizePX
        },
        horizontal: {
            height: outlineSizePX
        },
        corner: {
            width: outlineSizePX,
            height: outlineSizePX
        }
    }

    function computePosition(state: IState): IPoint {
        return {x: state.x, y: state.y};
    }

    const position = computePosition(state);
    const doc = props.document || document;

    const toggleUserSelect = (resizing: boolean) => {
        // this is a hack to disable user select of the document to prevent
        // parts of the UI from being selected

        if (resizing) {
            doc.body.style.userSelect = 'none';
        } else {
            doc.body.style.userSelect = 'auto';
        }

    };

    return (
        <>

            {/*{state.active &&*/}
            {/*    <ControlBar bottom={state.y} left={state.x} width={state.width}/>}*/}

            <Rnd
                ref={handleRndRef}
                id={props.id}
                bounds={props.bounds || "parent"}
                className={props.className}
                size={{
                    width: state.width,
                    height: state.height
                }}
                onMouseDown={() => toggleUserSelect(true)}
                onMouseUp={() => toggleUserSelect(false)}
                position={position}
                // onMouseOver={() => handleOnMouseOver()}
                // onMouseOut={() => handleOnMouseOut()}
                onDragStop={(e, d) => {
                    // handleResize({
                    //     ...state,
                    //     x: d.x,
                    //     y: d.y
                    // });
                }}
                onResizeStop={(event,
                               direction,
                               elementRef,
                               delta) => {

                    const box = computeNewBox(state, direction, delta);

                    handleResize({
                        ...state,
                        ...box,
                    }, direction);

                }}
                disableDragging={true}
                enableResizing={props.enableResizing}
                resizeHandleStyles={{
                    top: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.top,
                        ...resizeStyles.horizontal,
                        top: '0px'
                    },
                    bottom: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.bottom,
                        ...resizeStyles.horizontal,
                        bottom: '0px'
                    },
                    left: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.left,
                        ...resizeStyles.vertical,
                        left: '0px',
                    },
                    right: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.right,
                        ...resizeStyles.vertical,
                        right: '0px'
                    },
                    topLeft: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.topLeft,
                        ...resizeStyles.corner,
                        top: `0px`,
                        left: `0px`
                    },
                    topRight: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.topRight,
                        ...resizeStyles.corner,
                        top: `0px`,
                        right: `0px`
                    },
                    bottomLeft: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.bottomLeft,
                        ...resizeStyles.corner,
                        bottom: `0px`,
                        left: `0px`
                    },
                    bottomRight: {
                        ...resizeHandleStyle,
                        ...props.resizeHandleStyles?.bottomRight,
                        ...resizeStyles.corner,
                        bottom: `0px`,
                        right: `0px`
                    },
                }}
                style={{
                    ...props.style,
                    pointerEvents: 'none',
                }}
                {...dataProps}>
                {/*<div onContextMenu={props.onContextMenu}*/}
                {/*     style={{*/}
                {/*         width: state.width,*/}
                {/*         height: state.height*/}
                {/*     }}>*/}

                {/*</div>*/}
            </Rnd>
        </>
    );

})

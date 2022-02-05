import {HandleStyles, ResizeEnable, Rnd, RndDragCallback, RndResizeCallback} from "react-rnd";
import {ResizeDirection} from "re-resizable";
import * as React from "react";
import {useState} from "react";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useWindowResizeEventListener} from "../../../../web/js/react/WindowHooks";
import {IPoint} from "polar-shared/src/util/Point";
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
    readonly draggable?: boolean;

    readonly dragHandleClassName?: string;

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

    /**
     * Used to trigger a remount externally when we resize, scroll, etc.
     */
    readonly iter?: number;

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

function toggleUserSelect(doc: Document, resizing: boolean) {
    // this is a hack to disable user select of the document to prevent
    // parts of the UI from being selected

    if (resizing) {
        doc.body.style.userSelect = 'none';
        doc.body.style.webkitUserSelect = 'none';
    } else {
        doc.body.style.userSelect = 'auto';
        doc.body.style.webkitUserSelect = 'auto';
    }

}

export const ResizeBox: React.FC<IProps> = deepMemo(function ResizeBox(props) {

    const computeNewState = () => deriveStateFromInitialPosition(props.computePosition);

    const [state, setState] = useState<IState>(computeNewState);
    const scrollIntoViewRef = useScrollIntoViewUsingLocation();

    const rndRef = React.useRef<Rnd | null>(null);

    useWindowResizeEventListener('ResizeBox', () => {
        setState(computeNewState());
    }, {win: props.window});

    const handleRndRef = React.useCallback((rnd: Rnd | null) => {

        rndRef.current = rnd;
        // now handle the scroll ref so that we can jump to the pagemark...
        scrollIntoViewRef(rndRef.current ? rndRef.current.getSelfElement() : null);

    }, [scrollIntoViewRef]);



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

    }, [props.onResized, props.resizeAxis, state])

    // force pointer events on the resize corners.
    const resizeHandleStyle: React.CSSProperties = {
        pointerEvents: 'auto',
        ...(props.resizeHandleStyle || {})
    };

    const dataProps = Dictionaries.filter<any>(props, key => key.startsWith('data-'));

    const outlineSize = 10;
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

    const [previewRect, setPreviewRect] = React.useState<IBox>(() => computeNewState());

    const handleResizePreview: RndResizeCallback = React.useCallback((_, _1, _2, delta, pos) => {
        setPreviewRect({
            ...pos,
            width: state.width + delta.width,
            height: state.height + delta.height,
        });
    }, [state]);

    const handleDragPreview: RndDragCallback = React.useCallback((_1, pos) => {
        setPreviewRect(rect => ({
            ...rect,
            x: pos.x,
            y: pos.y,
        }));
    }, []);

    return (
        <>
            <Rnd
                ref={handleRndRef}
                id={props.id}
                bounds={props.bounds || "parent"}
                className={props.className}
                size={{
                    width: state.width,
                    height: state.height
                }}
                position={position}
                onDragStart={() => toggleUserSelect(doc, true)}
                onResizeStart={() => toggleUserSelect(doc, true)}
                onResize={handleResizePreview}
                onDrag={handleDragPreview}
                onDragStop={(_, d) => {
                    handleResize({
                        ...state,
                        x: d.x,
                        y: d.y
                    }, "right");
                    toggleUserSelect(doc, false)
                }}
                dragHandleClassName={props.dragHandleClassName}
                onResizeStop={(_,
                               direction,
                               ref,
                               _1,
                               position) => {

                    handleResize({
                        ...state,
                        ...position,
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                    }, direction);
                    toggleUserSelect(doc, false)
                }}
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
                    zIndex: 10,
                    pointerEvents: props.draggable ? 'auto' : 'none',
                    cursor: props.draggable ? 'move' : 'auto',
                }}
                {...dataProps}>
                {props.children}
            </Rnd>
            <div style={{
                    zIndex: 9,
                    ...props.style,
                    top: previewRect.y,
                    left: previewRect.x,
                    width: previewRect.width,
                    height: previewRect.height,
                    pointerEvents: 'none',
                }} />
        </>
    );

})

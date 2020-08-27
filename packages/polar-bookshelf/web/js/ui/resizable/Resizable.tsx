import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import { VerticalLine } from './VerticalLine';
import {HorizontalLine} from "./HorizontalLine";
import {IPoint} from "../../Point";

interface IProps {
    readonly color: string;

    readonly document?: Document;
    readonly window?: Window;

    readonly style?: React.CSSProperties;
    readonly className?: string;

    readonly resizeAxis?: 'y';

    readonly computeInitialPosition: () => ILTRect;

    readonly onResized?: (resizeRect: ILTRect) => void;

    readonly onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

}

type Direction = 'top' | 'bottom' | 'left' | 'right';

type MouseEventHandler = (event: MouseEvent) => void;

export const Resizable = deepMemo((props: IProps) => {

    const [position, setPosition] = React.useState<ILTRect>(props.computeInitialPosition())
    const positionRef = React.useRef(position);
    const mouseDown = React.useRef(false);
    const mouseEventOrigin = React.useRef<IPoint | undefined>(undefined);
    const mouseMoveHandler = React.useRef<MouseEventHandler | undefined>(undefined);
    const elementRef = React.useRef<HTMLElement | null>();

    const win = props.window || window;
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

    function updatePosition(position: ILTRect) {
        setPosition(position);
        positionRef.current = position;
    }

    const handleMouseUp = React.useCallback(() => {
        mouseDown.current = false;
        toggleUserSelect(false);
        win.removeEventListener('mousemove', mouseMoveHandler.current!);
    }, []);

    const handleMouseMove = React.useCallback((event: MouseEvent, direction: Direction) => {

        if (! mouseDown.current) {
            // the mouse wasn't clicked here...
            return;
        }

        const origin = mouseEventOrigin.current!;
        const delta = {
            x: event.clientX - origin.x,
            y: event.clientY - origin.y
        };

        function computeNewPosition(): ILTRect {

            switch (direction) {

                case "top":
                    return {
                        ...positionRef.current,
                        top: Math.min(positionRef.current.top + delta.y,
                                       positionRef.current.top + positionRef.current.height),
                        height: Math.max(positionRef.current.height - delta.y, 0)
                    };
                case "bottom":
                    return {
                        ...positionRef.current,
                        // FIXME: also don't allow this to be dragged too far to the top.
                        height: positionRef.current.height + delta.y
                    };
                case "left":
                    return {
                        ...positionRef.current,
                        left: Math.min(positionRef.current.left + delta.x,
                                       positionRef.current.left + positionRef.current.width),
                        width: Math.max(positionRef.current.width - delta.x, 0)
                    };
                case "right":
                    return {
                        ...positionRef.current,
                        width: positionRef.current.width + delta.x,
                    };

            }
        }

        updatePosition(computeNewPosition());
        mouseEventOrigin.current = event;

        if (props.onResized) {
            props.onResized(positionRef.current);
        }

    }, []);

    const handleMouseDown = React.useCallback((event: React.MouseEvent, direction: Direction) => {
        mouseDown.current = true;
        mouseEventOrigin.current = {x: event.clientX, y: event.clientY};

        toggleUserSelect(true);

        mouseMoveHandler.current = (event: MouseEvent) => handleMouseMove(event, direction);

        win.addEventListener('mousemove', mouseMoveHandler.current!);

        win.addEventListener('mouseup', () => {
            // this code properly handles the mouse leaving the window
            // during mouse up and then leaving wonky event handlers.
            handleMouseUp();
        }, {once: true});

    }, []);

    const style: React.CSSProperties = {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        overflow: 'none'
    }

    return (

        <div style={{...style, ...props.style}}
             ref={ref => elementRef.current = ref}
             draggable={false}
             className={props.className}
             onContextMenu={props.onContextMenu}>

            <VerticalLine side="left"
                          color={props.color}
                          height={position.height}
                          onMouseDown={event => handleMouseDown(event, 'left')}
                          onMouseUp={handleMouseUp}/>

            <VerticalLine side="right"
                          color={props.color}
                          height={position.height}
                          onMouseDown={event => handleMouseDown(event, 'right')}
                          onMouseUp={handleMouseUp}/>

            <HorizontalLine side="top"
                            color={props.color}
                            width={position.width}
                            onMouseDown={event => handleMouseDown(event, 'top')}
                            onMouseUp={handleMouseUp}/>

            <HorizontalLine side="bottom"
                            color={props.color}
                            width={position.width}
                            onMouseDown={event => handleMouseDown(event, 'bottom')}
                            onMouseUp={handleMouseUp}/>

        </div>

    );

})

import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import { VerticalLine } from './VerticalLine';
import {HorizontalLine} from "./HorizontalLine";
import {IPoint} from "../../Point";
import {Rects} from "../../Rects";
import {ILTRects} from "polar-shared/src/util/rects/ILTRects";
import {ILTBRRects} from "polar-shared/src/util/rects/ILTBRRects";

export type ResizableBounds = 'parent';

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

    readonly bounds?: ResizableBounds;

}

export type Direction = 'top' | 'bottom' | 'left' | 'right';

type MouseEventHandler = (event: MouseEvent) => void;

export const Resizable = deepMemo((props: IProps) => {

    const [position, setPosition] = React.useState<ILTRect>(props.computeInitialPosition())

    // the position while we're resizing then truncated to compute the position
    const resizingPositionRef = React.useRef(position);

    const mouseDown = React.useRef(false);
    const mouseEventOrigin = React.useRef<IPoint | undefined>(undefined);
    const mouseMoveHandler = React.useRef<MouseEventHandler | undefined>(undefined);
    const elementRef = React.useRef<HTMLElement | null>();

    const win = props.window || window;
    const doc = props.document || document;

    const computeBoundsParentElement = React.useCallback(() => {

        return elementRef.current?.parentElement;

    }, [elementRef.current]);

    const computeBoundsParentElementRect = React.useCallback((): ILTRect => {

        const boundsParentElement = computeBoundsParentElement();

        if (boundsParentElement) {
            return Rects.createFromOffset(boundsParentElement);
        }

        return Rects.createFromOffset(doc.body);

    }, [elementRef.current]);

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

        if (props.onResized) {
            props.onResized(position);
        }

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

        /**
         * Compute the position raw/directly from the current delta.
         */
        function computeResizingPosition(): ILTRect {

            switch (direction) {

                case "top":
                    return {
                        ...resizingPositionRef.current,
                        top: Math.min(resizingPositionRef.current.top + delta.y,
                                      resizingPositionRef.current.top + resizingPositionRef.current.height),
                        height: Math.max(resizingPositionRef.current.height - delta.y, 0)
                    };
                case "bottom":
                    return {
                        ...resizingPositionRef.current,
                        // FIXME: also don't allow this to be dragged too far to the top.
                        height: resizingPositionRef.current.height + delta.y
                    };
                case "left":
                    return {
                        ...resizingPositionRef.current,
                        left: Math.min(resizingPositionRef.current.left + delta.x,
                                       resizingPositionRef.current.left + resizingPositionRef.current.width),
                        width: Math.max(resizingPositionRef.current.width - delta.x, 0)
                    };
                case "right":
                    return {
                        ...resizingPositionRef.current,
                        width: resizingPositionRef.current.width + delta.x,
                    };

            }
        }

        /**
         * Compute the new position but factor in bounds too.
         */
        function computePosition(): ILTRect {

            const resizingPosition = computeResizingPosition();

            if (props.bounds) {

                const boundsParentElementRect = computeBoundsParentElementRect();

                const boundedLTRB = {
                    left: Math.max(resizingPosition.left, 0),
                    top: Math.max(resizingPosition.top, 0),
                    right: Math.min(resizingPosition.left + resizingPosition.width, boundsParentElementRect.width),
                    bottom: Math.min(resizingPosition.top + resizingPosition.height, boundsParentElementRect.height)
                }

                return ILTBRRects.toLTRect(boundedLTRB)

            }

            return resizingPosition;

        }

        resizingPositionRef.current = computeResizingPosition();

        updatePosition(computePosition());
        mouseEventOrigin.current = event;

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

namespace Intervals {

    /**
     * Return a point within the line or truncate it at either the start or end
     * of the line if it's within the range.
     */
    export function within(interval: Interval, point: number): number {

        if (point < interval.start) {
            return interval.start;
        }

        if (point > interval.end) {
            return interval.end;
        }

        return point;

    }

}

/**
 * A line with start and end inclusive.
 */
interface Interval {
    readonly start: number;
    readonly end: number;
}

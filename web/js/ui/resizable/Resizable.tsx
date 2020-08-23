import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import { VerticalLine } from './VerticalLine';
import {HorizontalLine} from "./HorizontalLine";
import {IPoint} from "../../Point";

interface IProps {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
    readonly color: string;

    readonly document?: Document;
    readonly window?: Window;

}

type Direction = 'top' | 'bottom' | 'left' | 'right';

type MouseEventHandler = (event: MouseEvent) => void;

export const Resizable = deepMemo((props: IProps) => {

    const [position, setPosition] = React.useState<ILTRect>(props)
    const positionRef = React.useRef(position);
    const mouseDown = React.useRef(false);
    const mouseEventOrigin = React.useRef<IPoint | undefined>(undefined);
    const mouseMoveHandler = React.useRef<MouseEventHandler | undefined>(undefined);

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

                // TODO: this would be cleaner as computePosition which just copies
                // the other properties and only mutates one

                case "top":
                    return {
                        ...positionRef.current,
                        top: positionRef.current.top + delta.y,
                    };
                case "bottom":
                    return {
                        ...positionRef.current,
                        height: positionRef.current.height + delta.y
                    };
                case "left":
                    return {
                        ...positionRef.current,
                        left: positionRef.current.left + delta.x,
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
    }

    return (

        <div style={style} draggable={false}>

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

import * as React from 'react';
import { useCallback, useRef, useState } from "react";

type OnLongPress = (event: React.MouseEvent | React.TouchEvent) => void;
type OnClick = () => void;

interface Opts {
    readonly shouldPreventDefault: boolean;
    readonly delay: number;
}

const defaultOpts = {
    shouldPreventDefault: true,
    delay: 300
};

// https://stackoverflow.com/questions/48048957/react-long-press-event
export function useLongPress(onLongPress: OnLongPress, onClick: OnClick, opts: Opts = defaultOpts) {

    const {shouldPreventDefault, delay} = opts;
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef<number>();
    const target = useRef<EventTarget>();

    const start = useCallback((event: React.MouseEvent | React.TouchEvent) => {

        if (shouldPreventDefault && event.target) {

            event.target.addEventListener("touchend", preventDefault, {
                passive: false
            });

            target.current = event.target;

        }

        timeout.current = window.setTimeout(() => {
            onLongPress(event);
            setLongPressTriggered(true);
        }, delay);

    }, [onLongPress, delay, shouldPreventDefault]);

    const clear = useCallback((event: React.MouseEvent | React.TouchEvent, shouldTriggerClick: boolean = true) => {

        if (timeout.current !== undefined) {
            clearTimeout(timeout.current);
        }

        if (shouldTriggerClick && ! longPressTriggered) {
            onClick();
        }

        setLongPressTriggered(false);
        if (shouldPreventDefault && target.current) {
            target.current.removeEventListener("touchend", preventDefault);
        }

    }, [shouldPreventDefault, onClick, longPressTriggered]);

    return {
        onMouseDown: (event: React.MouseEvent) => start(event),
        onTouchStart: (event: React.TouchEvent) => start(event),

        onMouseUp: (event: React.MouseEvent) => clear(event),
        onMouseLeave: (event: React.MouseEvent) => clear(event, false),
        onTouchEnd: (event: React.TouchEvent) => clear(event)
    };

}

const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent => {
    return "touches" in event && "preventDefault" in event;
}

const preventDefault = (event: any) => {

    if (!isTouchEvent(event)) {
        return;
    }

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }

};

export default useLongPress;

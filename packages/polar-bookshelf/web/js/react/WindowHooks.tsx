import React from 'react';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface WindowOpts {
    readonly win?: Window;
}

export type WindowEventListenerName = 'resize' | 'scroll' | 'contextmenu';

const listenerOpts = {
    // capture is needed for scroll to fire on window.
    capture: true,

    // passive is needed for performance improvements
    //
    // https://developers.google.com/web/updates/2016/06/passive-event-listeners
    passive: true
};

export function useWindowEventListener(name: WindowEventListenerName,
                                       delegate: () => void,
                                       opts: WindowOpts = {}) {

    const winRef = React.useRef(opts.win || window);

    React.useEffect(() => {

        const win = winRef.current;

        if (win) {

            if (typeof win.addEventListener !== 'function') {
                throw new Error("Window has no addEventListener in useWindowEventListener");
            }

            win.addEventListener(name, delegate, listenerOpts);

            return () => {

                if (win && typeof win.removeEventListener === 'function') {
                    win.removeEventListener(name, delegate, listenerOpts);
                }
            }

        }

        return NULL_FUNCTION;

    }, [delegate, name, winRef])

}

export function useWindowScrollEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('scroll', delegate, opts);
}

export function useWindowResizeEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('resize', delegate, opts);
}

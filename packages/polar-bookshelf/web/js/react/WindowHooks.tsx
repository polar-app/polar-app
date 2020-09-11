import React from 'react';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";
import {Preconditions} from "polar-shared/src/Preconditions";

interface WindowOpts {
    readonly win?: Window;
}

export type WindowEventListenerName = 'resize' | 'scroll' | 'contextmenu';

export function useWindowEventListener(name: WindowEventListenerName,
                                       delegate: () => void,
                                       opts: WindowOpts = {}) {

    const winRef = React.useRef(opts.win || window);

    const listenerOpts = {
        // capture is needed for scroll to fire on window.
        capture: true,

        // passive is needed for performance improvements
        //
        // https://developers.google.com/web/updates/2016/06/passive-event-listeners
        passive: true
    };

    useComponentDidMount(() => {
        winRef.current.addEventListener(name, delegate, listenerOpts);
    });

    useComponentWillUnmount(() => {

        if (winRef.current) {
            winRef.current.removeEventListener(name, delegate, listenerOpts);
        } else {
            console.warn("No window ref");
        }

    });

}

export function useWindowScrollEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('scroll', delegate, opts);
}

export function useWindowResizeEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('resize', delegate, opts);
}

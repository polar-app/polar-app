import React from 'react';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";

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
        if (winRef.current) {
            winRef.current.addEventListener(name, delegate, listenerOpts);
        } else {
            console.warn("ComponentDidMount: No window ref")
        }
    });

    useComponentWillUnmount(() => {

        if (winRef.current) {
            winRef.current.removeEventListener(name, delegate, listenerOpts);
        } else {
            console.warn("ComponentWillUnmount: No window ref");
        }

    });

}

export function useWindowScrollEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('scroll', delegate, opts);
}

export function useWindowResizeEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('resize', delegate, opts);
}

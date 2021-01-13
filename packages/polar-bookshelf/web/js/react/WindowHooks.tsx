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

/**
 *
 * @param name The event name
 * @param activity The activity name (used for debugging)
 * @param delegate The delegate to call.
 * @param opts The optional window.
 */
export function useWindowEventListener(name: WindowEventListenerName,
                                       activity: string,
                                       delegate: () => void,
                                       opts: WindowOpts = {}) {

    React.useEffect(() => {

        const win = opts.win || window;

        if (win) {

            if (typeof win.addEventListener !== 'function') {

                const msg = `Window has no addEventListener for ${name} with activity ${activity} in useWindowEventListener: ` + (typeof win.addEventListener);

                console.warn(msg, win);
                throw new Error(msg);

            }

            win.addEventListener(name, delegate, listenerOpts);

            return () => {

                if (win && typeof win.removeEventListener === 'function') {
                    win.removeEventListener(name, delegate, listenerOpts);
                }
            }

        }

        return NULL_FUNCTION;

    }, [activity, delegate, name, opts.win])

}

export function useWindowScrollEventListener(activity: string, delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('scroll', activity, delegate, opts);
}

export function useWindowResizeEventListener(activity: string,delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('resize', activity, delegate, opts);
}

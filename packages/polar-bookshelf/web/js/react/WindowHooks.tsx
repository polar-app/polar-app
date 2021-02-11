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

    interface IWindowDescriptor {
        readonly win: Window;
        readonly type: 'explicit' | 'default'
    }

    React.useEffect(() => {

        function computeWindowDescriptor(): IWindowDescriptor {

            if (opts.win) {

                return {
                    win: opts.win,
                    type: 'explicit'
                }

            } else {

                return {
                    win: window,
                    type: 'default'
                }

            }

        }

        const {win, type} = computeWindowDescriptor();

        if (win) {

            if (win.closed) {
                // this happens when the window is closed and listening to
                // events at this point would actually be silly.  We might not
                // actually even want to warn at that point.
                const msg = `Window ${type} has closed for ${name} with activity ${activity} in useWindowEventListener.`;
                console.warn(msg, win);
                return;
            }

            if (typeof win.addEventListener !== 'function') {

                const msg = `Window ${type} has no addEventListener for ${name} with activity ${activity} in useWindowEventListener: ` + (typeof win.addEventListener);

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

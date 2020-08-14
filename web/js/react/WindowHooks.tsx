import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";
import {Preconditions} from "polar-shared/src/Preconditions";

interface WindowOpts {
    readonly win?: Window;
}

function useWindowEventListener(name: 'resize' | 'scroll',
                                delegate: () => void,
                                opts: WindowOpts) {

    const win = opts.win || window;

    const listenerOpts = {
        // capture is needed for scroll to fire on window.
        capture: true,

        // passive is needed for performance improvements
        //
        // https://developers.google.com/web/updates/2016/06/passive-event-listeners
        passive: true
    };

    useComponentDidMount(() => {
        win.addEventListener(name, delegate, listenerOpts);
    });

    useComponentWillUnmount(() => {
        Preconditions.assertPresent(win, 'win');
        win.removeEventListener(name, delegate, listenerOpts);
    })

}

export function useScrollEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('scroll', delegate, opts);
}

export function useResizeEventListener(delegate: () => void, opts: WindowOpts = {}) {
    useWindowEventListener('resize', delegate, opts);
}

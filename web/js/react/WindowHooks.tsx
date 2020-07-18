import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/lifecycle";

function useWindowEventListener(name: 'resize' | 'scroll', delegate: () => void) {

    const opts = {
        // capture is needed for scroll to fire on window.\
        capture: true,

        // passive is needed for performance improvements
        //
        // https://developers.google.com/web/updates/2016/06/passive-event-listeners
        passive: true
    };

    useComponentDidMount(() => {
        window.addEventListener(name, delegate, opts);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener(name, delegate, opts);
    })

}

export function useScrollEventListener(delegate: () => void) {
    useWindowEventListener('scroll', delegate);
}

export function useResizeEventListener(delegate: () => void) {
    useWindowEventListener('resize', delegate);
}

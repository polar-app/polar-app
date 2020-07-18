import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/lifecycle";

function useWindowEventListener(name: 'resize' | 'scroll', delegate: () => void) {

    const opts = {capture: true};

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

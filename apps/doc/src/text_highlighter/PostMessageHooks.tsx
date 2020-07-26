import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/lifecycle";

/**
 * Use a window message listener but remove it when the component unmounts.
 */
export function useMessageListener(handler: (event: MessageEvent) => void) {

    // FIXME: epub needs a way to jump to pages and contexts... we're going to
    // need a way to inject a component for that...

    useComponentDidMount(() => {
        window.addEventListener('message', handler);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('message', handler);
    });

}

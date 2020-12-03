import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../../web/js/hooks/ReactLifecycleHooks";

/**
 * Use a window message listener but remove it when the component unmounts.
 */
export function useMessageListener(handler: (event: MessageEvent) => void) {

    useComponentDidMount(() => {
        window.addEventListener('message', handler);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('message', handler);
    });

}

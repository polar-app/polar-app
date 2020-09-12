import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/ReactLifecycleHooks";
import {deepMemo} from "../../react/ReactUtils";

export function isInputCompleteEvent(event: KeyboardEvent) {
    return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
}

interface InputCompleteListenerOpts {
    readonly onComplete: () => void;
    readonly onCancel?: Callback;
}

function useInputCompleteWindowListener(opts: InputCompleteListenerOpts) {

    const onKeyDown = React.useCallback((event: KeyboardEvent) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            opts.onComplete();
        }

        if (event.key === 'Escape' && opts.onCancel) {
            opts.onCancel();
        }

        event.preventDefault();
        event.stopPropagation();

    }, []);

    const stopPropagationHandler = React.useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('keydown', onKeyDown, {capture: true});
        window.addEventListener('keyup', stopPropagationHandler, {capture: true});
        window.addEventListener('keypress', stopPropagationHandler, {capture: true});
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('keydown', onKeyDown, {capture: true});
        window.removeEventListener('keypress', stopPropagationHandler, {capture: true});
        window.removeEventListener('keyup', stopPropagationHandler, {capture: true});
    });

}

interface IProps {
    readonly onComplete: Callback;
    readonly onCancel?: Callback;

    readonly children: React.ReactElement;
}

export const InputCompleteWindowListener = deepMemo((props: IProps) => {

    useInputCompleteWindowListener({
        onComplete: props.onComplete,
        onCancel: props.onCancel
    });

    return props.children;
});

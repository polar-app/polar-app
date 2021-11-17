import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {useComponentDidMount, useComponentWillUnmount} from "../../hooks/ReactLifecycleHooks";
import {deepMemo} from "../../react/ReactUtils";

export function isInputCompleteEvent(event: KeyboardEvent) {
    // this should be ctrl+enter and command+enter
    return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
}

interface InputCompleteListenerOpts {
    readonly onComplete: () => void;
    readonly onCancel?: Callback;
}

function useInputCompleteWindowListener(opts: InputCompleteListenerOpts) {

    const {onComplete, onCancel} = opts;

    const onKeyDown = React.useCallback((event: KeyboardEvent) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            onComplete();
        }

        if (event.key === 'Escape' && onCancel) {
            onCancel();
        }

        event.preventDefault();
        event.stopPropagation();

    }, [onCancel, onComplete]);

    // FIXME:
    //
    // this is using react's synthetic event listener system
    //
    // https://reactjs.org/docs/events.html

    const stopPropagationHandler = React.useCallback((event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    useComponentDidMount(() => {
        document.addEventListener('keydown', onKeyDown, {capture: true});
        document.addEventListener('keyup', stopPropagationHandler, {capture: true});
        document.addEventListener('keypress', stopPropagationHandler, {capture: true});
    });

    useComponentWillUnmount(() => {
        document.removeEventListener('keydown', onKeyDown, {capture: true});
        document.removeEventListener('keypress', stopPropagationHandler, {capture: true});
        document.removeEventListener('keyup', stopPropagationHandler, {capture: true});
        window.blur();
        window.focus();
    });

}

interface IProps {
    readonly onComplete: Callback;
    readonly onCancel?: Callback;

    readonly children: React.ReactElement;
}

export const InputCompleteWindowListener = deepMemo(function InputCompleteWindowListener(props: IProps) {

    useInputCompleteWindowListener({
        onComplete: props.onComplete,
        onCancel: props.onCancel
    });

    return props.children;
});

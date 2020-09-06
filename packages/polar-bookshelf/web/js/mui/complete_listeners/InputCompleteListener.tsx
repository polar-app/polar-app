import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";

export function isInputCompleteEvent(event: React.KeyboardEvent<HTMLInputElement>) {
    return (event.ctrlKey || event.metaKey) && event.key === 'Enter';
}

export function useInputCompleteListener(onComplete: () => void) {

    const onKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if (isInputCompleteEvent(event)) {
            event.preventDefault();
            event.stopPropagation();
            onComplete();
            return;
        }

    }, []);

    return {onKeyDown};

}

interface IProps {
    readonly onComplete: Callback;
    readonly children: JSX.Element;
}

export const InputCompleteListener = deepMemo((props: IProps) => {

    const handlers = useInputCompleteListener(props.onComplete);

    return <div {...handlers}>
        {props.children}
    </div>;

})
;

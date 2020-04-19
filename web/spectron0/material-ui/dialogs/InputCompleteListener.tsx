import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";

interface IProps {
    readonly onComplete: Callback;
    readonly children: JSX.Element;
}

export const InputCompleteListener = (props: IProps) => {

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        // note that react-hotkeys is broken when you listen to 'Enter' on
        // ObserveKeys when using an <input> but it doesn't matter because we
        // can just listen to the key directly

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            props.onComplete();
            return;
        }

    };

    return <div onKeyDown={handleKeyDown}>
        {props.children}
    </div>;

};

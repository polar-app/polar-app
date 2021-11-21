import * as React from "react";
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../react/ReactUtils";

const globalKeyMap = {
    ESCAPE: ['Escape'],
};

interface IProps {
    readonly onEscape: Callback;
    readonly children?: JSX.Element;
}

/**
 * Handle escape.  We have to use a global key binding so that it's not done at
 * root and a custom event listener so we abort when they type in an <input>
 * @param props @constructor
 */
export const InputEscapeListener = deepMemo(function InputEscapeListener(props: IProps) {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent | KeyboardEvent) => {

        if (event.key === 'Escape') {
            props.onEscape();
            event.stopPropagation();
            event.preventDefault();
            return;
        }

    }, [props]);

    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }

    }, [handleKeyDown])

    if (props.children) {
        return props.children;
    }

    return null;

});

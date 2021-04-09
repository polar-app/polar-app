import * as React from 'react';
import {deepMemo} from "../../react/ReactUtils";

interface IProps {
    readonly children: JSX.Element;
}

export const StopKeyboardEventPropagation = deepMemo(function StopKeyboardEventPropagation(props: IProps) {

    const handleEvent = React.useCallback((event: React.KeyboardEvent) => {
        event.stopPropagation();
    }, []);

    return (
        <div onKeyDown={handleEvent}
             onKeyUp={handleEvent}
             onKeyPress={handleEvent}>
            {props.children}
        </div>
    );

});

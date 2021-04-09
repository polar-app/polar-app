// @NotStale

import * as React from 'react';

interface IProps {
    readonly onComplete: () => void;
    readonly children: React.ReactElement;
}

export const CompleteListener = React.memo(function CompleteListener(props: IProps) {

    function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            // don't allow anything else to process this event.
            event.stopPropagation();
            event.preventDefault();
            props.onComplete();
        }

    }

    return (
        <div onKeyPress={event => handleKeyPress(event)}>
            {props.children}
        </div>
    );

});

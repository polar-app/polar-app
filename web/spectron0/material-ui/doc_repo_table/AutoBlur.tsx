import React from "react";

/**
 * AutoBlur the active element when selected so that we can receive events
 * or avoid the item being selected to avoid bugs (like arrow keys or enter
 * triggering another operation)
 */
export const AutoBlur = (props: any) => {

    let ref: HTMLDivElement | null;

    const handleClick = () => {

        if (document.activeElement !== null) {
            (document.activeElement as HTMLElement).blur();
        }

    };

    return (
        <div ref={_ref => ref = _ref}
             onClick={() => handleClick()}>
            {props.children}
        </div>
    );

};



import React from "react";

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



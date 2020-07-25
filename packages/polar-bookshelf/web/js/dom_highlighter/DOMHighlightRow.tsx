import React from 'react';
import {memoForwardRef} from "../react/ReactUtils";
import {Highlights} from "./Highlights";
import intersectWithWindow = Highlights.intersectWithWindow;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;

interface IProps extends IHighlightViewportPosition {
    readonly id: string;
}

/**
 * Handles rendering a single row of non-overflow text.
 */
export const DOMHighlightRow = memoForwardRef((props: IProps) => {

    if (! intersectWithWindow(props)) {
        // if the position is actually offscreen, don't draw it to save
        // some CPU..
        return null;
    }

    // we use the absolute position so that on scroll nothing is actually updated
    const absolutePosition = Highlights.fixedToAbsolute(props);

    return (
        <div id={props.id}
             style={{
                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
                 position: 'absolute',
                 ...absolutePosition
             }}>

        </div>
    )

});

import React from 'react';
import {memoForwardRef} from "../react/ReactUtils";
import {Highlights} from "./Highlights";
import intersectsWithWindow = Highlights.intersectsWithWindow;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;

interface IProps extends IHighlightViewportPosition {
    readonly id: string;
    readonly color?: string;
}

/**
 * Handles rendering a single row of non-overflow text.
 */
export const DOMHighlightRow = memoForwardRef((props: IProps) => {

    if (! intersectsWithWindow(props)) {
        // if the position is actually offscreen, don't draw it to save
        // some CPU..
        return null;
    }

    // we use the absolute position so that on scroll nothing is actually updated
    const absolutePosition = Highlights.fixedToAbsolute(props);

    const backgroundColor = props.color || 'rgba(255, 255, 0, 0.5)';

    return (
        <div id={props.id}
             className="polar-ui"
             style={{
                 backgroundColor: `${backgroundColor}`,
                 position: 'absolute',
                 pointerEvents: 'none',
                 mixBlendMode: 'overlay',
                 ...absolutePosition
             }}>

        </div>
    )

});

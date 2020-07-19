import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {
    useResizeEventListener,
    useScrollEventListener
} from "../../web/js/react/WindowHooks";
import {Highlights} from "./Highlights";
import {AnimationFrameDebouncer} from "./AnimationFrameDebouncer";
import IHighlightNode = Highlights.IHighlightNode;
import IPosition = Highlights.IViewportPosition;
import createPosition = Highlights.createViewportPosition;
import intersectWithWindow = Highlights.intersectWithWindow;
import withAnimationFrame = AnimationFrameDebouncer.withAnimationFrame;


interface IProps extends IHighlightNode {
}

export const HitHighlighter = memoForwardRef((props: IProps) => {

    const [position, setPosition] = React.useState<IPosition>(createPosition(props))

    const redrawCallback = React.useCallback(withAnimationFrame(() => {
        setPosition(createPosition(props));
    }), []);

    useScrollEventListener(redrawCallback);
    useResizeEventListener(redrawCallback);

    if (! intersectWithWindow(position)) {
        // if the position is actually offscreen, don't draw it to save
        // some CPU..
        return null;
    }

    // we use the absolute position so that on scroll nothing is actually updated
    const absolutePosition = Highlights.fixedToAbsolute(position);

    return (
        <div style={{
                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
                 position: 'absolute',
                 ...absolutePosition
             }}>

        </div>
    )

});

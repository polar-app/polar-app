import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {
    useResizeEventListener,
    useScrollEventListener
} from "../../web/js/react/WindowHooks";
import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Rects} from "../../web/js/Rects";

interface IPosition {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;
}

interface IHighlightNode {
    readonly start: number;
    readonly end: number;
    readonly node: Node;
}

interface IProps extends IHighlightNode {
}

function createPosition(highlight: IHighlightNode): IPosition {

    const range = document.createRange();
    range.setStart(highlight.node, highlight.start);
    range.setEnd(highlight.node, highlight.end);

    const rect = range.getBoundingClientRect();

    return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
    };

}

/**
 * Debouncer that use requestAnimationFrame
 */
function withAnimationFrame(delegate: () => void): () => void {

    let pending: boolean = false;

    function handleDelegate() {

        try {
            delegate();
        } finally {
            pending = false;
        }

    }

    return () => {

        if (pending) {
            return;
        }

        window.requestAnimationFrame(handleDelegate);

        pending = true;

    };

}

function intersects(parent: ILTRect, child: ILTRect): boolean {

    return Rects.intersect(Rects.createFromBasicRect(parent), Rects.createFromBasicRect(child));

}

function intersectWithWindow(position: IPosition) {

    const parent: ILTRect = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
    };

    return intersects(parent, position);

}

export const HitHighlighter = memoForwardRef((props: IProps) => {

    // FIXME: this WORKS but for some reason there is some lag which is mildly
    // distracting

    const [position, setPosition] = React.useState<IPosition>(createPosition(props))

    const redrawCallback = React.useCallback(withAnimationFrame(() => {
        setPosition(createPosition(props));
    }), []);

    useScrollEventListener(redrawCallback);
    useResizeEventListener(redrawCallback);

    // FIXME: if the position is actually offscreen, don't draw it to save
    // some CPU..

    // FIXME: could we improve performance by computing the position relative
    // to the document, not the client rect...

    if (! intersectWithWindow(position)) {
        return null;
    }

    return (
        <div style={{
                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
                 position: 'fixed',
                 ...position
             }}>

        </div>
    )

});

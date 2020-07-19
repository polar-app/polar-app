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

    console.log("FIXME highlight: ", highlight);

    const range = document.createRange();
    range.setStart(highlight.node, highlight.start);
    // FIXME I think setEnd is NOT inclusive ... but I think there's another bug...
    range.setEnd(highlight.node, highlight.end + 1);

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

/**
 * Convert a fixed position to an absolute position.
 */
function fixedToAbsolute(rect: ILTRect): ILTRect {

    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height
    };

}

export const HitHighlighter = memoForwardRef((props: IProps) => {

    // FIXME ... searching for "In practice" starts off at the wrong place...
    // "Graph" does the same thing...

    // FIXME if a highlight is across rows, then what happens is that we get a
    // break to the next row... we might want to just highlight the individual
    // elements so that we don't have to mutate the DOM and node split...

    // FIXME: I think having ONE div per character is probably a BAD idea but
    // so is DOM mutation from within React ... it's hacky but I could put it
    // into a hook...

    // FIXME: I'm going to need unit tests for common operations:

    // FIXME: what I could do here is split the text by words... based on whitespace
    //
    // FIXME: I would ALSO need to join the text so that the current highlight
    // runs up , I think. to the start of the next node, but this might trigger a warap

    // FIXME: do not split the node based on the text, split the regions we
    // want to highlight... so that each reagoin would start off like
    //
    // 'hello world'
    //
    // and then I would map them to:
    //
    // 'hello '
    // 'world'

    //   - nodes with extra whitespace
    //   - queries that span nodes
    //   - queries that span nodes with whitespace]

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
    const absolutePosition = fixedToAbsolute(position);

    return (
        <div style={{
                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
                 position: 'absolute',
                 ...absolutePosition
             }}>

        </div>
    )

});

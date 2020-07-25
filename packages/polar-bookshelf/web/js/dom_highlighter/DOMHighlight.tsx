import {memoForwardRef} from "../react/ReactUtils";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import React from "react";
import {
    useResizeEventListener,
    useScrollEventListener
} from "../react/WindowHooks";
import {DOMHighlightRow} from "./DOMHighlightRow";
import {Highlights} from "./Highlights";
import {AnimationFrameDebouncer} from "./AnimationFrameDebouncer";
import withAnimationFrame = AnimationFrameDebouncer.withAnimationFrame;
import toHighlightViewportPositions = Highlights.toHighlightViewportPositions;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;

interface IProps extends DOMTextHit {
    readonly id: string;
}

/**
 * An individual highlight that might need to be split across rows.
 */
export const DOMHighlight = memoForwardRef((props: IProps) => {

    const {regions} = props;

    const [highlightViewportPositions, setHighlightViewportPositions] = React.useState(toHighlightViewportPositions(regions))

    const redrawCallback = React.useCallback(withAnimationFrame(() => {
        setHighlightViewportPositions(toHighlightViewportPositions(regions));
    }), []);

    if (props.regions.length === 0) {
        // no work to do...
        return null;
    }

    function computeWindow(): Window {
        // this is a big hacky as we need to figure out which window is holding
        // the node.
        return props.regions[0].node.ownerDocument!.defaultView!;
    }

    const win = computeWindow();

    useScrollEventListener(redrawCallback, {win});
    useResizeEventListener(redrawCallback, {win});

    function toDOMHighlighterRow(highlightViewportPosition: IHighlightViewportPosition, idx: number) {

        const id = idx === 0 ? props.id : (props.id + ":" + idx);

        const key = `${highlightViewportPosition.nodeID}:${highlightViewportPosition.start}:${highlightViewportPosition.end}`;
        return <DOMHighlightRow {...highlightViewportPosition}
                                id={id}
                                key={key}/>
    }

    return (
        <>
            {highlightViewportPositions.map(toDOMHighlighterRow)}
        </>
    );

});

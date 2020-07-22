import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import React from "react";
import {
    useResizeEventListener,
    useScrollEventListener
} from "../../web/js/react/WindowHooks";
import {DOMHighlightRow} from "./DOMHighlightRow";
import {Highlights} from "./Highlights";
import {AnimationFrameDebouncer} from "./AnimationFrameDebouncer";
import withAnimationFrame = AnimationFrameDebouncer.withAnimationFrame;
import toHighlightViewportPositions = Highlights.toHighlightViewportPositions;
import IHighlightViewportPosition = Highlights.IHighlightViewportPosition;

interface IProps extends DOMTextHit {

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

    useScrollEventListener(redrawCallback);
    useResizeEventListener(redrawCallback);

    function toDOMHighlighterRow(highlightViewportPosition: IHighlightViewportPosition) {
        const key = `${highlightViewportPosition.nodeID}:${highlightViewportPosition.start}:${highlightViewportPosition.end}`;
        return <DOMHighlightRow {...highlightViewportPosition}
                                key={key}/>
    }

    return (
        <>
            {highlightViewportPositions.map(toDOMHighlighterRow)}
        </>
    );

});

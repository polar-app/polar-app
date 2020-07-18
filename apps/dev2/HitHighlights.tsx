import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {
    DOMTextHit,
    NodeTextRegion
} from "polar-dom-text-search/src/DOMTextSearch";
import {HitHighlighter} from "./HitHighlighter";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

interface IProps {
    readonly hits: ReadonlyArray<DOMTextHit>;
}

export const HitHighlights = memoForwardRef((props: IProps) => {

    function toHitHighlighter(nodeTextRegion: NodeTextRegion, idx: number) {

        // FIXME: compute a key with a specific ID of the node and the start+end
        //
        const key = `${nodeTextRegion.idx}:${nodeTextRegion.start}:${nodeTextRegion.end}`;

        return <HitHighlighter start={nodeTextRegion.start}
                               end={nodeTextRegion.end}
                               node={nodeTextRegion.node}
                               key={key}/>
    }

    const flatHits = arrayStream(props.hits)
                        .flatMap(current => current.regions)
                        .collect();

    return (
        <>
            {flatHits.map(toHitHighlighter)}
        </>
    );

})

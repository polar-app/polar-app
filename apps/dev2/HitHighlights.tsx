import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {HitHighlighter} from "./HitHighlighter";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {NodeTextRegion} from 'polar-dom-text-search/src/NodeTextRegion';
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";

interface IProps {
    readonly hits: ReadonlyArray<DOMTextHit>;
}

export const HitHighlights = memoForwardRef((props: IProps) => {

    function toHitHighlighter(nodeTextRegion: NodeTextRegion, idx: number) {

        // FIXME this isn't unique enough for a key because it's not global so we
        // could get one that doesn't refresh
        const key = `${nodeTextRegion.nodeID}:${nodeTextRegion.start}:${nodeTextRegion.end}`;

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

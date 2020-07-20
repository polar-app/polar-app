import React from 'react';
import {memoForwardRef} from "../../web/js/react/ReactUtils";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import {HitHighlight} from "./HitHighlight";

interface IProps {
    readonly hits: ReadonlyArray<DOMTextHit>;
}

// HitHighlights -> HitHighlight => HitHighlightRow

export const HitHighlights = memoForwardRef((props: IProps) => {

    function toHitHighlight(hit: DOMTextHit, idx: number) {
        return <HitHighlight key={idx} {...hit}/>

    }

    return (
        <>
            {props.hits.map(toHitHighlight)}
        </>
    );

})

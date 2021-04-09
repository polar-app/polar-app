import React from 'react';
import {memoForwardRef} from "../react/ReactUtils";
import {DOMTextHit} from "polar-dom-text-search/src/DOMTextHit";
import {DOMHighlight} from "./DOMHighlight";

interface IProps {
    readonly hits: ReadonlyArray<DOMTextHit>;
}

// HitHighlights -> HitHighlight => HitHighlightRow

export const DOMHighlights = memoForwardRef(function DOMHighlights(props: IProps) {

    function toDOMHighlight(hit: DOMTextHit) {
        return <DOMHighlight key={hit.id} {...hit}/>
    }

    return (
        <>
            {props.hits.map(toDOMHighlight)}
        </>
    );

})

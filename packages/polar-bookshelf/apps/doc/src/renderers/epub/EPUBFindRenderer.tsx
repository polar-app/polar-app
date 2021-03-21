import React from 'react';
import ReactDOM from 'react-dom';
import {DOMHighlights} from "../../../../../web/js/dom_highlighter/DOMHighlights";
import {memoForwardRef} from "../../../../../web/js/react/ReactUtils";
import {useEPUBFinderStore} from './EPUBFinderStore';
import {useEPUBRoot} from "./EPUBFinders";

/**
 * Renders the results found with the find controller.
 */
export const EPUBFindRenderer = memoForwardRef(function EPUBFindRenderer() {

    const {hits, current} = useEPUBFinderStore(['hits', 'current']);

    const epubRoot = useEPUBRoot();

    if (hits === undefined || current === undefined) {
        return null;
    }

    return ReactDOM.createPortal(<DOMHighlights hits={hits}/>, epubRoot.root);

});

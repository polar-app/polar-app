import React from 'react';
import * as ReactDOM from "react-dom";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {useDOMTextIndexContext} from "./DOMTextIndexContext";
import {Texts} from 'polar-shared/src/metadata/Texts';
import {DOMHighlight} from "../../../../web/js/dom_highlighter/DOMHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";

interface IProps {
    readonly annotation: ITextHighlight;
    readonly container: HTMLElement,
}

/**
 * Text highlight layout that uses the text of the annotation, not the actual
 * fixes position.
 */
export const TextHighlightRendererDynamic = deepMemo((props: IProps) => {

    const {annotation, container} = props;
    const domTextIndexContext = useDOMTextIndexContext();
    const text = Texts.toText(annotation.text);

    if (! domTextIndexContext) {
        console.log("No domTextIndexContext");
        return null;
    }

    if (! text) {
        console.log("No text for highlight: " + annotation.id);
        return null;
    }

    const {index} = domTextIndexContext;

    const hit = index.find(text, {caseInsensitive: true});

    if (! hit) {
        console.log("No hit for text: ", text);
        return null;
    }

    const color = HighlightColors.toBackgroundColor(annotation.color || 'yellow', 0.5);

    // this is a bit unclean because it assumes the container is 'body' but it
    // is actually trying to be a sibling to 'body' so that EPUB CSS rules
    // don't conflict.

    if (! container) {
        return null;
    }

    return ReactDOM.createPortal(<DOMHighlight {...hit}
                                               color={color}
                                               id={annotation.id}/>, container);

});

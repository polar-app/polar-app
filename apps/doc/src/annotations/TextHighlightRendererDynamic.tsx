import React from 'react';
import * as ReactDOM from "react-dom";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {useDOMTextIndexContext} from "./DOMTextIndexContext";
import { Texts } from 'polar-shared/src/metadata/Texts';
import {DOMHighlight} from "../../../../web/js/dom_highlighter/DOMHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";

interface IProps {
    readonly textHighlight: ITextHighlight;
    readonly container: HTMLElement,
}

/**
 * Text highlight layout that uses the text of the annotation, not the actual
 * fixes position.
 */
export const TextHighlightRendererDynamic = memoForwardRef((props: IProps) => {

    const {textHighlight, container} = props;
    const {index} = useDOMTextIndexContext();
    const text = Texts.toText(textHighlight.text);

    if (! text) {
        console.log("No text for highlight: " + textHighlight.id);
        return null;
    }

    const hit = index.find(text, {caseInsensitive: true});

    if (! hit) {
        console.log("No hit for text: ", text);
        return null;
    }

    const color = HighlightColors.toBackgroundColor(textHighlight.color || 'yellow', 0.5);

    // this is a bit unclean because it assumes the container is 'body' but it
    // is actually trying to be a sibling to 'body' so that EPUB CSS rules
    // don't conflict.
    const portalContainer = container.parentElement!;

    return ReactDOM.createPortal(<DOMHighlight color={color} {...hit}/>, portalContainer);

});

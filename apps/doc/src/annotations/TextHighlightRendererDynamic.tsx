import React from 'react';
import * as ReactDOM from "react-dom";
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {useDOMTextIndexContext} from "./DOMTextIndexContext";
import { Texts } from 'polar-shared/src/metadata/Texts';
import {DOMHighlight} from "../../../../web/js/dom_highlighter/DOMHighlight";

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

    // FIXME: we don't want to have to rebuild the case insensitivity version
    // of this index each time.
    const hit = index.find(text, {caseInsensitive: true});

    if (! hit) {
        console.log("No hit for text: ", text);
        return null;
    }

    return ReactDOM.createPortal(<DOMHighlight {...hit}/>, container);

});

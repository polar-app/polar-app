import React from 'react';
import * as ReactDOM from "react-dom";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {useDOMTextIndexContext} from "./DOMTextIndexContext";
import {Texts} from 'polar-shared/src/metadata/Texts';
import {DOMHighlight} from "../../../../web/js/dom_highlighter/DOMHighlight";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {PageAnnotation} from "./PageAnnotations";
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {IBlockTextHighlight} from 'polar-blocks/src/annotations/IBlockTextHighlight';

interface IProps {
    readonly id: string;
    readonly pageAnnotation: PageAnnotation<ITextHighlight | IBlockTextHighlight>;
    readonly container: HTMLElement,
    readonly onClick?: React.EventHandler<React.MouseEvent>;
}

/**
 * Text highlight layout that uses the text of the annotation, not the actual
 * fixes position.
 */
export const TextHighlightRendererDynamic = deepMemo(function TextHighlightRendererDynamic(props: IProps) {

    const {pageAnnotation, container, onClick = NULL_FUNCTION} = props;
    const {annotation} = pageAnnotation;
    const domTextIndexContext = useDOMTextIndexContext();
    const text = Texts.toText(annotation.text);

    if (! domTextIndexContext) {
        console.log("No domTextIndexContext");
        return null;
    }

    if (! text) {
        console.log("No text for highlight: " + props.id);
        return null;
    }

    const {index} = domTextIndexContext;

    const hit = index.find(text, {caseInsensitive: true});

    if (! hit) {
        // console.log("No hit for text: ", text);
        return null;
    }


    console.log(`FIXME: rendering N regions for ID: ${hit.id}: ` + hit.regions.length);

    const color = HighlightColors.toBackgroundColor(annotation.color || 'yellow', 0.5);

    // this is a bit unclean because it assumes the container is 'body' but it
    // is actually trying to be a sibling to 'body' so that EPUB CSS rules
    // don't conflict.

    if (! container) {
        return null;
    }

    const {fingerprint, pageNum} = pageAnnotation;

    const className = `text-highlight annotation text-highlight-${props.id}`;

    return ReactDOM.createPortal(<DOMHighlight {...hit}
                                               color={color}
                                               data-doc-fingerprint={fingerprint}
                                               data-text-highlight-id={props.id}
                                               data-page-num={pageNum}
                                               data-annotation-type="text-highlight"
                                               data-annotation-id={props.id}
                                               data-annotation-page-num={pageNum}
                                               data-annotation-doc-fingerprint={fingerprint}
                                               data-annotation-color={color}
                                               className={className}
                                               onClick={onClick}
                                               id={props.id}/>, container);

});

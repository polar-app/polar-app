import React from 'react';
import {memoForwardRef} from "../../../../web/js/react/ReactUtils";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";

interface IProps {
    readonly textHighlight: ITextHighlight;
    readonly container: HTMLElement,
}

/**
 * Text highlight layout that uses the text of the annotation, not the actual
 * fixes position.
 */
export const TextHighlightRendererDynamic = memoForwardRef(() => {

    return null;

});

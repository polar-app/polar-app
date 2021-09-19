import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockTextHighlight} from "./IBlockTextHighlight";

export namespace BlockTextHighlights {
    
    /**
     * Get the text contents of a text highlight
     *
     * @param textHighlight - A text highlight block object.
     *
     * @return {string}
     */
    export function toText(textHighlight: IBlockTextHighlight): MarkdownStr {
        return textHighlight.revisedText !== undefined ? textHighlight.revisedText : textHighlight.text;
    }
}

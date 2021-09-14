import {IBlockTextHighlight} from "./IBlockTextHighlight";

export namespace BlockTextHighlights {
    
    /*
     * Get the text of a text highlight
     *
     * @param {IBlockTextHighlight} textHighlight - A block text highlight object.
     */
    export function toText(textHighlight: IBlockTextHighlight): string {
        return textHighlight.revisedText || textHighlight.text;
    }
}

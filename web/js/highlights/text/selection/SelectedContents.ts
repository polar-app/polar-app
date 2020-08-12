import {Ranges} from './Ranges';
import {ISelectedContent} from './ISelectedContent';
import {Selections} from './Selections';
import {RectTexts} from '../controller/RectTexts';
import {HTMLSanitizer} from 'polar-html/src/sanitize/HTMLSanitizer';
import {TextNodeRows} from "./TextNodeRows";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {FileType} from "../../../apps/main/file_loaders/FileType";

export namespace SelectedContents {

    export interface ComputeOpts {

        /**
         * When true we do not return rects as this splits/mutates the DOM
         */
        readonly noRectTexts?: boolean;

        readonly fileType: FileType;

    }

    /**
     * Compute the SelectedContents based on the page offset, not the
     * client/viewport offset, and include additional metadata including the
     * text of the selection, the html, etc.
     */
    export function computeFromWindow(win: Window, opts: ComputeOpts) {
        const selection = win.getSelection()!;
        return computeFromSelection(selection, opts);
    }

    export function computeFromSelection(selection: Selection, opts: ComputeOpts): ISelectedContent {

        // get all the ranges and clone them so they can't vanish.
        const ranges = Ranges.cloneRanges(Selections.toRanges(selection));

        // now get the text and the sanitized HTML
        const text = selection.toString();
        const html = HTMLSanitizer.sanitize(SelectedContents.toHTML(ranges));

        function computeRectTexts() {

            const textNodes = arrayStream(ranges)
                .map(Ranges.getTextNodes)
                .flatMap(current => current)
                .collect();

            const textNodesRows = TextNodeRows.fromTextNodes(textNodes);

            return RectTexts.toRectTexts(textNodesRows);

        }

        function computeOrder(): number | undefined {

            if (opts.fileType === 'pdf') {
                return undefined;
            }

            if (ranges.length === 0) {
                return 0;
            }

            return ranges[0].getBoundingClientRect().top;
        }

        const rectTexts = opts.noRectTexts === true ? [] : computeRectTexts();

        const order = computeOrder();

        return {
            text,
            html,
            rectTexts,
            order
        };

    }

    /**
     * Compute the given ranges as HTML, factoring in sanitization as well.
     */
    export function toHTML(ranges: ReadonlyArray<Range>) {
        return ranges.map(range => Ranges.toHTML(range)).join("");
    }

}

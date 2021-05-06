import {Ranges} from './Ranges';
import {ISelectedContent} from './ISelectedContent';
import {Selections} from './Selections';
import {RectTexts} from '../controller/RectTexts';
import {HTMLSanitizer} from 'polar-html/src/sanitize/HTMLSanitizer';
import {TextNodeRows} from "./TextNodeRows";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {FileType} from "../../../apps/main/file_loaders/FileType";
import {RectText} from '../controller/RectText';
import {TextHighlightMerger} from '../../../../../apps/doc/src/text_highlighter/TextHighlightMerger';
import {Rect} from '../../../Rect';

export namespace SelectedContents {

    export interface ComputeOpts {

        /**
         * When true we do not return rects as this splits/mutates the DOM
         */
        readonly noRectTexts?: boolean;

        readonly fileType: FileType;
    }

    // Split up words (Fi-nance). Join and remove the hyphen
    export const lineNeedsHyphenElimination = (line: string) => /[^\s]-$/.test(line);

    // Ranges (100-300) && words that start with <non->. Join with no space in between
    export const lineNeedsHyphenJoin = (line: string) =>  /\d+-$/.test(line) || (/[^\s]-$/.test(line) && /non-$/i.test(line));

    export function extractText(rects: ReadonlyArray<RectText>): string {
        const mergeRectTexts = (a: RectText, b: RectText, withWhitespace: boolean): RectText => {
            const rect = new Rect(TextHighlightMerger.mergeRects(a.boundingClientRect, b.boundingClientRect));
            const val ={
                boundingClientRect: rect,
                text: a.text + (withWhitespace ? ' ' : '') + b.text,
                selectionRange: a.selectionRange,
            };
            return val;
        };

        const rectPositions = rects.map(x => x.boundingClientRect);

        const wordThresholds = TextHighlightMerger.getWordThresholds(rectPositions);
        const lineThresholds = TextHighlightMerger.getLineThresholds(rectPositions);

        const words = TextHighlightMerger.words(rects, wordThresholds, a => a.boundingClientRect)
            .map(group => group.reduce((a, b) => mergeRectTexts(a, b, false)));
        const lines = TextHighlightMerger.lines(words, lineThresholds, a => a.boundingClientRect)
            .map(group => group.reduce((a, b) => mergeRectTexts(a, b, true)));


        let text = '';

        for (const line of lines) {
            const currText = line.text.trim();

            if (lineNeedsHyphenJoin(currText)) {
                text += currText;
            } else if (lineNeedsHyphenElimination(currText)) {
                text += currText.slice(0, -1)
            } else {
                text += currText + ' ';
            }
        }

        return text.replace(/\s+/g, ' ').trim();
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

        const html = HTMLSanitizer.sanitize(toHTML(ranges));

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

            // TODO this isn't perfect because if we are resizing the EPUB
            // there's no way to determine the right position. I would need some
            // way to find out where things would reflow and with CSS it's
            // imprecise.

            const scrollY = ranges[0].startContainer?.parentElement?.ownerDocument?.defaultView?.scrollY;

            return ranges[0].getBoundingClientRect().top + (scrollY || 0);

        }

        const rectTexts = opts.noRectTexts === true ? [] : computeRectTexts();

        function computeText(): string {

            // TODO this is a bug because PDF.js DOES split text into divs but
            // we're not actually certain if they're 'lines' because the divs
            // are absolutely positioned.

            if (rectTexts.length > 0) {
                // this is PDF mode so we should just compute the text via join
                // the rect texts...

                return extractText(rectTexts)
            }

            return toText(ranges)

        }


        const text = computeText();

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

    export function toText(ranges: ReadonlyArray<Range>) {
        return ranges.map(range => Ranges.toText(range)).join("");
    }

}

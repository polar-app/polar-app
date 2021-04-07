import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContentEscaper} from "../MarkdownContentEscaper";

export namespace CursorPositions {

    /**
     * Represents a position that can be stored using the selection API.
     */
    export interface ICursorPosition {
        readonly node: Node;
        readonly offset: number;
    }

    /**
     * Like ICursorPosition but used an ID for the node so that the data is
     * deterministic for test and can be converted to JSON
     */
    export interface ICursorPositionTest {

        /**
         * The actual text of the entire node.
         */
        readonly nodeText: string;

        readonly offset: number;

    }

    /**
     * Allows us to lookup the ICursorPosition in via offset.
     */
    export type CursorLookupArray = ReadonlyArray<ICursorPosition>;

    export type CursorLookupTestArray = ReadonlyArray<ICursorPositionTest>;

    export function jumpToPosition(element: HTMLElement, offset: number) {

        const lookup = computeCursorLookupArray(element);

        const position = lookup[offset];

        if (position) {

            const sel = window.getSelection();

            if (sel) {
                const range = sel.getRangeAt(0);
                range.setStart(position.node, position.offset);
                range.setEnd(position.node, position.offset);
            }

        } else {
            console.warn("No lookup position for: ", offset);
        }

    }

    /**
     * Create a lookup array from the text offset in the root element to the
     * node and local offset for that text so that we can place our cursor
     * there.
     */
    export function computeCursorLookupArray(element: HTMLElement): CursorLookupArray {

        // FIXME: create tests and a lookup array by ID that allows us to test us
        // and have a node ID not the node so we can use this as JSON

        const doc = element.ownerDocument;

        // tslint:disable-next-line:no-bitwise
        const treeWalker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT);

        let offset = 0;

        const result: ICursorPosition[] = [];

        for(let currentNode: Node | null = treeWalker.currentNode; currentNode !== null; currentNode = treeWalker.nextNode()) {

            const textContent = currentNode.textContent || '';

            for (let idx = 0; idx < textContent.length; ++idx) {
                const ptr = offset + idx;

                const position: ICursorPosition = {
                    node: currentNode,
                    offset: idx
                };

                result[ptr] = position;

            }

            offset = textContent.length;

        }

        return result;

    }

    /**
     * Convert the lookup array to data so we can test it.
     */
    export function toCursorLookupTestArray(arr: CursorLookupArray): CursorLookupTestArray {

        function toCursorPositionTest(cursorPosition: ICursorPosition): ICursorPositionTest {

            const nodeText: string = cursorPosition.node.textContent || '';
            const offset = cursorPosition.offset;
            return {nodeText, offset};

        }

        return arr.map(toCursorPositionTest);

    }

    /**
     * The length of the content, as rendered HTML.  Markdown might not be the
     * same length because of issues like **bold**.
     */
    export function renderedTextLength(markdown: MarkdownStr) {
        const html = MarkdownContentEscaper.escape(markdown);
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.innerText.length;
    }

}

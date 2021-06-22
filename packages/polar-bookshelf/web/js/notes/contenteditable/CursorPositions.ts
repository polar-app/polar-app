import {MarkdownStr} from "polar-shared/src/util/Strings";
import {MarkdownContentConverter} from "../MarkdownContentConverter";

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

    export function jumpToPosition(node: Node, offset: number) {

        const lookup = computeCursorLookupArray(node);

        const position = lookup[offset];

        const range = window.getSelection()!.getRangeAt(0);

        if (position) {

            range.setStart(position.node, position.offset);
            range.setEnd(position.node, position.offset);

        } else if (offset === lookup.length) {

            function computeRangeNode() {

                if (lookup.length > 0) {
                    return lookup[lookup.length - 1].node;
                }

                return range.startContainer;

            }

            const rangeNode = computeRangeNode();
            const rangeOffset = (rangeNode.nodeValue || '').length

            range.setStart(rangeNode, rangeOffset);
            range.setEnd(rangeNode, rangeOffset);

        } else {
            console.warn(`No lookup position for offset ${offset} with N lookup elements: ` + lookup.length);
        }

    }

    /**
     * Create a lookup array from the text offset in the root element to the
     * node and local offset for that text so that we can place our cursor
     * there.
     */
    export function computeCursorLookupArray(node: Node): CursorLookupArray {

        const lookup: ICursorPosition[] = [];

        function doBuild(offset: number, node: Node) {

            if (node.nodeType === node.TEXT_NODE) {

                const nodeValue = node.nodeValue || '';

                for (let idx = 0; idx < nodeValue.length; ++idx) {
                    const ptr = offset + idx;

                    const position: ICursorPosition = {
                        node,
                        offset: idx
                    };

                    lookup[ptr] = position;

                }

                offset += nodeValue.length;

            }

            if (node.nodeType === node.ELEMENT_NODE) {

                for(const childNode of Array.from(node.childNodes)) {
                    offset = doBuild(offset, childNode);
                }

            }

            return offset;

        }

        doBuild(0, node);

        return lookup;

    }

    export function computeContentEditableRoot(node: Node | null): HTMLElement {

        if (node === null) {
            throw new Error("Unable to find content editable root");
        }

        if (node.nodeType === node.TEXT_NODE) {
            return computeContentEditableRoot(node.parentElement);
        }

        if (node.nodeType === node.ELEMENT_NODE) {

            const element = node as HTMLElement;

            if (element.getAttribute('contenteditable') === 'true') {
                return element;
            }

            return computeContentEditableRoot(element.parentElement);

        }

        throw new Error("Invalid node type: " + node.nodeType);

    }

    export function toTextNode(node: Node | undefined, offset: number): ICursorPosition | undefined {
        if (!node) {
            return  undefined;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            return toTextNode(node.childNodes[offset], 0);
        }

        return {node, offset};
    }

    export function computeCurrentOffset(element: HTMLElement): 'end' | number | undefined {

        const lookup = computeCursorLookupArray(element);

        const selection = document.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const positionInTextNode = toTextNode(range.startContainer, range.startOffset);

            if (positionInTextNode) {
                const {node, offset} = positionInTextNode;

                // NOTE: this is O(N) but N is almost always insanely small.
                for (let idx = 0; idx < lookup.length; ++idx) {

                    const curr = lookup[idx];

                    if (node === curr.node) {

                        if (offset === curr.offset) {
                            return idx;
                        }

                    }

                }
            } else {
                return 0;
            }
        }

        return 'end';

    }

    /**
     * Convert the lookup array to data so we can test it.
     */
    export function toCursorLookupTestArray(arr: CursorLookupArray): CursorLookupTestArray {

        function toCursorPositionTest(cursorPosition: ICursorPosition): ICursorPositionTest {

            const nodeText: string = cursorPosition.node.nodeValue || '';
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
        const html = MarkdownContentConverter.toHTML(markdown);
        const div = document.createElement('div');
        div.innerHTML = html;
        return (div.innerText || div.textContent || '').length;
    }

    export function setCaretPosition(elem: Node, position: 'start' | 'end' | number) {
        const range = new Range();
        switch (position) {
            case 'start':
                range.setStartBefore(elem);
                range.setEndBefore(elem);
                break;
            case 'end':
                range.setStartAfter(elem);
                range.setEndAfter(elem);
                break;
            default:
                range.setStart(elem, position);
                range.setStart(elem, position);
                break;
        }
        const selection = document.getSelection();

        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };
}

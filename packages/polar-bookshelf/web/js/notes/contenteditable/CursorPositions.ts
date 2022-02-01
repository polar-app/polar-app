import {MarkdownStr} from "polar-shared/src/util/Strings";
import {ContentEditables} from "../ContentEditables";
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

    export function defineNewRange(range: Range) {
        const sel = window.getSelection();

        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    export function clearSelection() {
        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0) {
            selection.getRangeAt(0).collapse(true);
        }
    }

    /*
     * This is used to focus stuff that isn't focusable contentEditable=false elements for example.
     *
     * We just create an empty text node after the contentEditable=false node and focus that instead.
     */
    export function focusEnd(node: Node): void {
        const range = new Range();
        const textNode = document.createTextNode('');
        node.parentNode!.insertBefore(textNode, node.nextSibling);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        defineNewRange(range);
    }

    export function jumpToPosition(elem: HTMLElement, offset: number | 'start' | 'end', preventScroll: boolean = false) {

        elem.focus({ preventScroll });

        const focusNode = (node: Node | null, position: 'start' | 'end') => {
            if (! node) {
                return;
            }
            if (ContentEditables.isContentEditable(node)) { // If the child is editable then just focus it
                const range = new Range();
                if (position === 'start') {
                    range.setStartBefore(node);
                    range.setEndBefore(node);
                } else {
                    range.setStartAfter(node);
                    range.setEndAfter(node);
                }
                defineNewRange(range);
            } else { // Otherwise just put it at the end
                focusEnd(node);
            }
        };

        if (offset === 'start' || offset === 0) {
            focusNode(elem.firstChild, 'start');
        } else if (offset === 'end') {
            focusNode(elem.lastChild, 'end');
        } else {
            const lookup = computeCursorLookupArray(elem);

            const position = lookup[offset];

            if (position) {

                if (ContentEditables.isContentEditable(position.node)) {
                    const range = new Range();
                    range.setStart(position.node, position.offset);
                    range.setEnd(position.node, position.offset);
                    defineNewRange(range);
                } else {
                    const contentEditableFalseRoot = ContentEditables.computeContentEditableFalseRoot(position.node);
                    focusEnd(contentEditableFalseRoot);
                }

            } else if (offset >= lookup.length) {
                jumpToPosition(elem, 'end');
            }
        }

        // Failsafe: if for some reason we still manage to lose the cursor just put it at the start
        const selection = document.getSelection();
        if (selection && selection.rangeCount === 0) {
            elem.focus();
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


    export function toTextNode(node: Node | undefined, offset: number): ICursorPosition | undefined {
        if (!node) {
            return  undefined;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const childNode = node.childNodes[offset];
            if (childNode) {
                return toTextNode(childNode, 0);
            } else {
                const lastNode = node.lastChild;
                if (lastNode) {
                    return toTextNode(lastNode, (lastNode.textContent || '').length);
                } else {
                    return {node, offset: 0};
                }
            }
        }

        return {node, offset};
    }

    export function computeCurrentOffset(element: HTMLElement): 'end' | number | undefined {

        if ((element.textContent || '').length === 0 && element.childNodes.length === 0) {
            return 0;
        }

        const lookup = computeCursorLookupArray(element);

        const selection = document.getSelection();

        if (! selection || selection.rangeCount === 0) {
            return 0;
        }

        const range = selection.getRangeAt(0);
        const positionInTextNode = toTextNode(range.startContainer, range.startOffset);

        if (! positionInTextNode) {
            return 0;
        }

        const getIdxForNode = (positionInTextNode: ICursorPosition) => {
            const {node, offset} = positionInTextNode;

            // NOTE: this is O(N) but N is almost always insanely small.
            for (let idx = 0; idx < lookup.length; ++idx) {

                const curr = lookup[idx];
                const next = lookup[idx + 1];

                if (node === curr.node) {

                    if (offset === curr.offset || next && next.node !== curr.node) {
                        return idx;
                    }

                }
            }

            return undefined;
        }

        const position = getIdxForNode(positionInTextNode);

        if (position !== undefined) {
            return position;
        }

        // Try the next sibling
        // This is because we might have the cursor in an empty text node (a workaround for focusing contentEditable=false)
        const sibling = positionInTextNode.node.nextSibling;
        if (sibling) {
            const siblingPositionInTextNode = toTextNode(sibling, 0);

            if (! siblingPositionInTextNode) {
                return 0;
            }

            const siblingPosition = getIdxForNode(siblingPositionInTextNode);

            if (siblingPosition !== undefined) {
                return siblingPosition;
            }
        }


        return lookup.length;
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

    export function isCursorAtSide(elem: HTMLElement, side: 'top' | 'bottom'): boolean {
        const elemRect = elem.getBoundingClientRect();
        const selection = window.getSelection();


        if (! selection || selection.rangeCount === 0) {
            return false;
        }

        const range = selection.getRangeAt(0);

        const cursorRect = ContentEditables.getRangeBoundingClientRect(range);

        const styles = window.getComputedStyle(elem);

        const lineHeight = (+styles.lineHeight.slice(0, -2)) || 12;
        const threshold = lineHeight / 2;

        elem.normalize();

        return side === 'top'
            ? Math.abs(cursorRect.top - elemRect.top) < threshold
            : Math.abs(cursorRect.bottom - elemRect.bottom) < threshold;
    }
}

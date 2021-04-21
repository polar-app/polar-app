
export namespace ContentEditables {

    export interface ISplit {
        readonly prefix: DocumentFragment;
        readonly suffix: DocumentFragment;
    }

    export function splitAtCursor(editable: HTMLElement): ISplit | undefined {

        const sel = window.getSelection();

        if (sel) {

            if (sel.rangeCount > 0) {

                const range = sel.getRangeAt(0);

                if (! range.collapsed) {
                    return undefined;
                }

                function createPrefixRange() {
                    const prefixRange = document.createRange();
                    prefixRange.setStartBefore(editable);
                    prefixRange.setEnd(range.startContainer, range.startOffset);
                    return prefixRange;
                }

                function createSuffixRange() {
                    const suffixRange = document.createRange();
                    const endPosition = computeEndNodeOffset(editable);
                    suffixRange.setStart(range.startContainer, range.startOffset);
                    suffixRange.setEnd(endPosition.node, endPosition.offset);
                    return suffixRange;
                }

                const prefixRange = createPrefixRange();
                const suffixRange = createSuffixRange();

                return {
                    prefix: prefixRange.cloneContents(),
                    suffix: suffixRange.cloneContents()
                }

            }

        }

        return undefined;

    }


    export function fragmentToHTML(fragment: DocumentFragment) {
        const div = document.createElement('div');
        div.append(fragment);
        return div.innerHTML;
    }

    export function fragmentToText(fragment: DocumentFragment) {
        const div = document.createElement('div');
        div.append(fragment);
        return div.innerText;
    }

    export function cursorAtStart(editable: HTMLElement): boolean {

        const split = splitAtCursor(editable);

        if (split) {
            return fragmentToText(split.prefix) === '';
        }

        return false;

    }

    export function cursorAtEnd(editable: HTMLElement): boolean {

        const split = splitAtCursor(editable);

        if (split) {
            return fragmentToText(split.suffix) === '';
        }

        return false;

    }

    /**
     * Node and offset pair for working with ranges.
     */
    export interface INodeOffset {
        readonly node: Node;
        readonly offset: number;
    }

    export function computeStartNodeOffset(node: Node): INodeOffset {

        const parentElement = node.parentElement!;

        if (! parentElement) {
            throw new Error("No parent element");
        }

        const offset = Array.from(parentElement.childNodes).indexOf(node as any);

        return {node: parentElement, offset};

    }

    export function computeEndNodeOffset(node: Node): INodeOffset {

        if (node.nodeType === document.TEXT_NODE) {

            return {
                node,
                offset: node.textContent !== null ? node.textContent.length : 0,
            }

        }

        if (node.childNodes.length > 0) {
            return computeEndNodeOffset(node.childNodes[node.childNodes.length - 1]);
        }

        return {
            node,
            offset: 0
        };

    }

    /**
     * Compute a range that covers the entire node.
     */
    export function computeCoveringRange(node: Node) {

        const range = document.createRange();

        const startNodeOffset = computeStartNodeOffset(node);
        const endNodeOffset = computeEndNodeOffset(node);

        range.setStart(startNodeOffset.node, startNodeOffset.offset);
        range.setEnd(endNodeOffset.node, endNodeOffset.offset);

        return range;

    }

    export function currentRange(): Range | undefined {

        const sel = window.getSelection();

        if (sel) {

            if (sel.rangeCount > 0) {
                return sel.getRangeAt(0);
            }

        }

        return undefined;

    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Range/compareBoundaryPoints
    export function selectionAtEnd(node: Node): boolean {
        const coveringRange = computeCoveringRange(node);
        return selectionBoundaryPointsEqual(Range.END_TO_END, coveringRange);
    }

    export function selectionAtStart(node: Node): boolean {
        const coveringRange = computeCoveringRange(node);
        // return selectionBoundaryPointsEqual(Range.START_TO_START, coveringRange);

        // TODO: we should be able to compare start_to_start and the bounding client range
        // seems to map up with that well but it still doesn't work.

        const range = currentRange();

        if (! range) {
            return false;
        }

        const rangeBCR = range.getBoundingClientRect();
        const sourceRangeBCR = coveringRange.getBoundingClientRect();

        return rangeBCR.left === sourceRangeBCR.left

    }

    function selectionBoundaryPointsEqual(how: number, sourceRange: Range) {

        const range = currentRange();

        if (range) {
            return range.compareBoundaryPoints(how, sourceRange) === 0;
        }

        return false;

    }


}

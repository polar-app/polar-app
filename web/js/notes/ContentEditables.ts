
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
                    const endPosition = computeEndCursorSelectionRange(editable);
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

    export function isSuffixSelected() {

    }

    export function computeCursorPosition(editable: HTMLElement): 'start' | 'end' | undefined {

        const split = splitAtCursor(editable);

        if (split) {

            if (fragmentToText(split.prefix) === '') {
                return 'start';
            }

            if (fragmentToText(split.suffix) === '') {
                return 'end';
            }

        }

        return undefined;

    }

    export interface ICursorSelectionRange {
        readonly node: Node;
        readonly offset: number;
    }

    export function computeEndCursorSelectionRange(node: Node): ICursorSelectionRange {

        if (node.nodeType === document.TEXT_NODE) {


            return {
                node,
                offset: node.textContent !== null ? node.textContent.length : 0,
            }

        }

        if (node.childNodes.length > 0) {
            return computeEndCursorSelectionRange(node.childNodes[node.childNodes.length - 1]);
        }

        return {
            node,
            offset: 0
        };

    }

    export function computeRangeAtStart(node: Node) {

        const range = document.createRange();
        // range.setStartAfter(node);
        // range.setEndAfter(node);

        const parentElement = node.parentElement!;

        if (! parentElement) {
            throw new Error("No parent element");
        }

        const index = Array.from(parentElement.childNodes).indexOf(node as any);

        console.log("FIXME parentElement: ", parentElement);
        console.log("FIXME index: ", index);

        range.setStart(parentElement, index);
        range.setEndAfter(node);

        return range;

    }

    export function computeRangeAtEnd(node: Node) {

        const cursorSelectionRange = computeEndCursorSelectionRange(node);
        const range = document.createRange();

        range.setStart(cursorSelectionRange.node, cursorSelectionRange.offset);
        range.setEnd(cursorSelectionRange.node, cursorSelectionRange.offset);

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
        return selectionBoundaryPointsEqual(Range.END_TO_END, computeRangeAtEnd(node));
    }

    export function selectionAtStart(node: Node): boolean {

        const range = currentRange();
        const sourceRange = computeRangeAtStart(node);

        if (range) {

            const rangeBCR = range.getBoundingClientRect();
            const sourceRangeBCR = sourceRange.getBoundingClientRect();

            console.log("FIXME: rangeBCR: ", rangeBCR)
            console.log("FIXME: sourceRangeBCR: ", sourceRangeBCR)

            return rangeBCR.left === sourceRangeBCR.left

        }

        return false;

    }

    function selectionBoundaryPointsEqual(how: number, sourceRange: Range) {

        const range = currentRange();

        if (range) {

            console.log("FIXME: range bcr: ", range.getBoundingClientRect())
            console.log("FIXME: sourceRange bcr: ", range.getBoundingClientRect())

            const delta = range.compareBoundaryPoints(how, sourceRange);
            console.log("FIXME delta: ", delta);
            return delta === 0;
        }

        console.log("FIXME no range");

        return false;

    }


}

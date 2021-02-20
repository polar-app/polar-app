
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
                    const endPosition = computeEndCursorPosition(editable);
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

    interface ICursorPosition {
        readonly node: Node;
        readonly offset: number;
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

    export function computeEndCursorPosition(node: Node): ICursorPosition {

        if (node.nodeType === document.TEXT_NODE) {

            return {
                node,
                offset: node.textContent !== null ? node.textContent.length : 0,
            }

        }

        if (node.childNodes.length > 0) {
            return computeEndCursorPosition(node.childNodes[node.childNodes.length - 1]);
        }

        return {
            node,
            offset: 0
        };

    }

}

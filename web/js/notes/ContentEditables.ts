
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

                const prefixRange = document.createRange();
                prefixRange.setStartBefore(editable);
                prefixRange.setEnd(range.endContainer, range.endOffset);

                const suffixRange = document.createRange();
                prefixRange.setStart(range.startContainer, range.startOffset);
                prefixRange.setEndAfter(editable);

                return {
                    prefix: prefixRange.cloneContents(),
                    suffix: suffixRange.cloneContents()
                }

            }

        }

        return undefined;

    }

}

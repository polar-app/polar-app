export namespace NoteContentCanonicalizer {

    export function canonicalizeElement(element: HTMLElement) {
        return canonicalize(element.cloneNode(true)) as HTMLElement
    }

    function canonicalize(node: Node) {

        if (node.nodeType !== node.ELEMENT_NODE) {
            // just return what we have now
            return node
        }

        const result = node;

        const childNodes = Array.from(node.childNodes)
                                .map(current => canonicalize(current));

        for (const childNode of childNodes) {

            if (needsRewrite(childNode)) {
                childNode.replaceWith(...Array.from(childNode.childNodes));
            } else {
                result.appendChild(childNode);
            }

        }

        return result;

    }

    function toText(node: Node | null) {

        if (node === null) {
            return 'null';
        }

        if (node.nodeType === node.TEXT_NODE) {
            return 'Text: ' + node.textContent;
        }

        return node.textContent;

    }

    function needsRewrite(node: Node): node is HTMLSpanElement {

        if (node.nodeType !== node.ELEMENT_NODE) {
            return false;
        }

        if (! node.parentElement) {
            return false;
        }

        const element = node as HTMLElement;

        return element.tagName.toLowerCase() === 'span';

    }


}

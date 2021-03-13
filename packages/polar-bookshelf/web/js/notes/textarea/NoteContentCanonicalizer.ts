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

                let pointer: Node = childNode;

                // *** now remove all these nodes from the current node.
                for (const current of Array.from(childNode.childNodes)) {
                    childNode.parentElement!.insertBefore(current, pointer.nextSibling);
                    childNode.removeChild(current);
                    pointer = childNode;
                }

                // *** now remove the span
                childNode.parentElement!.removeChild(childNode);

            } else {
                result.appendChild(childNode);
            }

        }

        return result;

    }

    function needsRewrite(node: Node): boolean {

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

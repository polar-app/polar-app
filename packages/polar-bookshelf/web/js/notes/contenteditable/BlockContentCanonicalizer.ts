export namespace BlockContentCanonicalizer {

    export function canonicalizeElement(element: HTMLElement) {
        return doA(doSPAN(element.cloneNode(true))) as HTMLElement;
    }

    function doSPAN(node: Node) {

        if (node.nodeType !== node.ELEMENT_NODE) {
            // just return what we have now
            return node
        }

        const result = node;

        const childNodes = Array.from(node.childNodes)
                                .map(current => doSPAN(current));

        for (const childNode of childNodes) {

            if (needsRewrite(childNode)) {
                childNode.replaceWith(...Array.from(childNode.childNodes));
            } else {
                result.appendChild(childNode);
            }

        }

        return result;

    }

    function doA(node: Node) {

        if (node.nodeType !== node.ELEMENT_NODE) {
            // just return what we have now
            return node
        }

        const element = node as HTMLElement;

        for (const anchor of Array.from(element.querySelectorAll('a'))) {

            const href = anchor.getAttribute('href');
            const newTextContent = (anchor.textContent || '').trim();

            if (href && href.startsWith('#')) {
                const newHref = '#' + newTextContent;
                if (href !== newHref) {
                    anchor.setAttribute('href', newHref);
                }
            }

            if (anchor.textContent !== newTextContent) {
                anchor.textContent = newTextContent;
            }

        }

        return element;

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

import {IRect, MutableIRect} from "polar-shared/src/util/rects/IRect";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IDStr} from "polar-shared/src/util/Strings";

function getScrollParent(element: Node | undefined): HTMLElement | undefined {

    if (! element) {
        return undefined;
    }

    if (! (element instanceof HTMLElement)) {
        // this only applies when we're working with a 'node' which could be
        // text or an attribute, etc.
        return getScrollParent(element.parentElement || undefined);
    }

    if (element.scrollHeight > element.clientHeight) {
        return element;
    } else {
        return getScrollParent(element.parentElement || undefined);
    }

}

export interface ITextHighlighterOpts {

    readonly id: string;

    readonly targets: ReadonlyArray<Node>;

}

export class BoundingClientRects {

    public static compute(node: Node): DOMRect {

        const computeWithHTMLElement = (element: HTMLElement): DOMRect => {
            return element.getBoundingClientRect();
        };

        const computeWithNode = (node: Node): DOMRect => {
            const range = document.createRange();

            try {

                range.selectNode(node);
                return range.getBoundingClientRect();

            } finally {
                range.detach();
            }

        };

        if (node instanceof HTMLElement) {
            return computeWithHTMLElement(node);
        }

        return computeWithNode(node);

    }

}

export class TextHighlighter {

    private static applyHighlight(opts: ITextHighlighterOpts) {

        const {targets} = opts;

        const getOrCreateHighlightElement = (id: IDStr) => {

            let highlightElement = document.getElementById(id);

            if (! highlightElement) {

                highlightElement = document.createElement('div');
                highlightElement.id = id;

                // make it part of the DOM now
                document.body.appendChild(highlightElement);

            }

            return highlightElement;

        };

        for (const target of Arrays.toIndexed(targets)) {

            const id = opts.id + '#' + target.index;


            const highlightElement = getOrCreateHighlightElement(id);

            highlightElement.style.position = 'fixed';
            highlightElement.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';

            const scrollParent = getScrollParent(target.value);

            if (! scrollParent) {
                continue;
            }

            const scrollParentRect = scrollParent.getBoundingClientRect();

            const rect = BoundingClientRects.compute(target.value);

            const intersectRect = IntersectRects.compute(rect, scrollParentRect);

            // console.log("rect: " , rect);
            // console.log("scroll parent rect: " , scrollParentRect);
            // console.log("intersectRect: " , intersectRect);

            if (intersectRect.height > 0 && intersectRect.width > 0) {

                highlightElement.style.display = 'block';

                highlightElement.style.top = `${intersectRect.top}px`;
                highlightElement.style.bottom = `${intersectRect.bottom}px`;
                highlightElement.style.left = `${intersectRect.left}px`;
                highlightElement.style.right = `${intersectRect.right}px`;
                highlightElement.style.width = `${intersectRect.width}px`;
                highlightElement.style.height = `${intersectRect.height}px`;

            } else {
                highlightElement.style.display = 'none';
            }

        }

    }

}

class IntersectRects {

    public static compute(a: IRect, b: IRect): IRect {

        const result: MutableIRect = {
            top: Math.max(a.top, b.top),
            bottom: Math.min(a.bottom, b.bottom),
            left: a.left,
            right: a.right,
            height: 0,
            width: 0
        };

        result.height = result.bottom - result.top;
        result.width = result.right - result.left;

        return result;

    }

}

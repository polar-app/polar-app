import { Numbers } from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace NodeTextBoundingClientRects {

    interface INodeTextBoundingClientRect {

        readonly text: Text;
        readonly start: number;
        readonly end: number;

        readonly left: number;
        readonly top: number;
        readonly width: number;
        readonly height: number;

    }

    // https://javascript.info/selection-range
    // https://stackoverflow.com/questions/1461059/is-there-an-equivalent-to-getboundingclientrect-for-text-nodes
    export function compute(element: HTMLElement): ReadonlyArray<INodeTextBoundingClientRect> {

        const childNodes = Array.from(element.childNodes);

        const result: INodeTextBoundingClientRect[] = [];

        for (const childNode of childNodes) {

            switch (childNode.nodeType) {
                case Node.ELEMENT_NODE:
                    result.push(...compute(childNode as HTMLElement));
                    break;
                case Node.TEXT_NODE:
                    result.push(...computeForTextNode(childNode as Text));
                    break;
            }

        }

        return result;

    }

    function computeNodeTextBoundingClientRect(text: Text,
                                               start: number,
                                               end: number): INodeTextBoundingClientRect {

        const range = document.createRange();
        range.setStart(text, start);
        range.setEnd(text, end);

        const bcr = range.getBoundingClientRect();

        return {
            text, start, end,
            left: bcr.left,
            top: bcr.top,
            width: bcr.width,
            height: bcr.height
        };

    }

    function computeForTextNode(text: Text) {

        return Numbers.range(0, text.length - 1)
            .map(start => computeNodeTextBoundingClientRect(text, start, start + 1));

    }

    export function computeNearest(nodes: ReadonlyArray<INodeTextBoundingClientRect>,
                                   left: number,
                                   top: number): INodeTextBoundingClientRect | undefined {

        interface IDistance {
            readonly node: INodeTextBoundingClientRect,
            readonly distance: number;
        }

        function computeDistance(node: INodeTextBoundingClientRect): IDistance {
            const distance = Math.abs(left - node.left) + Math.abs(top - node.top);
            return {distance, node};
        }

        return arrayStream(nodes)
            .map(computeDistance)
            .sort((a, b) => a.distance - b.distance)
            .first()?.node;

    }

}

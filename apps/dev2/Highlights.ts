import { ILTRect } from "polar-shared/src/util/rects/ILTRect";
import {Rects} from "../../web/js/Rects";

export namespace Highlights {

    export interface IPosition {
        readonly top: number;
        readonly left: number;
        readonly width: number;
        readonly height: number;
    }

    export interface IHighlightNode {
        readonly start: number;
        readonly end: number;
        readonly node: Node;
    }


    export function intersects(parent: ILTRect, child: ILTRect): boolean {

        return Rects.intersect(Rects.createFromBasicRect(parent), Rects.createFromBasicRect(child));

    }

    export function intersectWithWindow(position: IPosition) {

        const parent: ILTRect = {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };

        return intersects(parent, position);

    }

    export function createPosition(highlight: IHighlightNode): IPosition {

        const range = document.createRange();
        range.setStart(highlight.node, highlight.start);
        // FIXME I think setEnd is NOT inclusive ... but I think there's another bug...
        range.setEnd(highlight.node, highlight.end + 1);

        const rect = range.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

    }

    /**
     * Convert a fixed position to an absolute position.
     */
    export function fixedToAbsolute(rect: ILTRect): ILTRect {

        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height
        };

    }

}

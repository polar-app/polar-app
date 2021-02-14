import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Direction} from "../../FluidPagemarkFactory";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export interface IRangeRect {
    readonly top: number;
    readonly bottom: number;
}

export interface IDefaultView {
    readonly scrollY: number;
}

export interface IOwnerDocument {
    readonly defaultView: IDefaultView | null;
}

/**
 * Simple element definition so that we can use HTMLElement or a mock one for
 * testing
 */
export interface IHTMLElement {
    readonly ownerDocument: IOwnerDocument;
    readonly getBoundingClientRect: () => ILTRect;
}

export namespace RangeRects {

    export function fromElement(element: IHTMLElement): IRangeRect {
        const bcr = element.getBoundingClientRect();
        const top = bcr.top + element.ownerDocument.defaultView!.scrollY;
        const bottom = top + bcr.height;
        return {top, bottom};
    }

    export function fromRect(rect: ILTRect) {
        return {
            top: rect.top,
            bottom: rect.top + rect.height
        };
    }

    export function contains(container: IRangeRect, item: IRangeRect): boolean {
        return item.top > container.top && item.bottom < container.bottom;
    }

}

export namespace FluidElementPredicates {

    // TODO: I think we can refactor this into just a generalizable model where
    // we compute top/bottom and left/right as a linear equation with a
    // coefficient of direction (1 or -1) to invert it and use the same math
    // for distance, filter, etc.  Also, the distance function can be used to
    // compute the filter because a negative distance would be rejected.

    interface IFluidElementPredicate<E extends IHTMLElement> {

        /**
         * Create a predicate for filtering elements that would be before/after
         * the element in the HTML flow.
         */
        readonly filter: (element: E) => boolean;

        /**
         * Pick the most likely candidate from the items.
         */
        readonly select: (elements: ReadonlyArray<E>) => ISelected<E>;

    }

    export type Edge = 'top' | 'bottom';

    interface ITarget<E> {
        readonly value: E;
        readonly distance: number;
        readonly edge: Edge;
    }

    export interface ElementDistance<E> extends ITarget<E> {
    }

    export interface ISelected<E> {

        readonly elementDistances: ReadonlyArray<ElementDistance<E>>;

        /**
         * The resulting element to target the pagemark pointer.
         */
        readonly target: ITarget<E> | undefined;

    }

    export function create<E extends IHTMLElement>(direction: Direction, boxRect: IRangeRect): IFluidElementPredicate<E> {

        function toPointer(rect: IRangeRect) {
            return direction === 'top' ? rect.top : rect.bottom
        }

        function filter(element: E): boolean {
            const elementRect = RangeRects.fromElement(element);
            return RangeRects.contains(boxRect, elementRect)
        }

        function select(elements: ReadonlyArray<E>): ISelected<E> {

            // computes the CLOSEST endpoint to the item based on direction

            const boxRectPointer = toPointer(boxRect);

            function toJSON() {
                return elements.map((current, idx) => {
                    return {
                        idx,
                        // offsetTop: current.clientTop,
                        // clientHeight: current.clientTop
                    }
                });
            }

            function computeDistance(element: E): ElementDistance<E> {
                const elementRect = RangeRects.fromElement(element);

                const topDistance = Math.abs(elementRect.top - boxRectPointer);
                const bottomDistance = Math.abs(elementRect.bottom - boxRectPointer);

                function computeDistanceAndEdge(): [number, Edge] {

                    if (topDistance < bottomDistance) {
                        return [topDistance, 'top'];
                    } else {
                        return [bottomDistance, 'bottom'];
                    }

                }

                const [distance, edge] = computeDistanceAndEdge();

                return {value: element, distance, edge};
            }

            const elementDistances
                = arrayStream(elements)
                    .map(computeDistance)
                    .sort((a, b) => a.distance - b.distance)
                    .collect();

            const target = Arrays.first(elementDistances);

            return {elementDistances, target};

        }

        return {filter, select}

    }

}

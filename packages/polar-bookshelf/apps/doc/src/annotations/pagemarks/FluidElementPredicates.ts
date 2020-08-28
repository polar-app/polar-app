import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Direction} from "../../FluidPagemarkFactory";

export interface IRangeRect {
    readonly top: number;
    readonly bottom: number;
}

/**
 * Simple element definition so that we can use HTMLElement or a mock one for
 * testing
 */
export interface IHTMLElement {
    readonly offsetTop: number;
    readonly offsetHeight: number;
}

export namespace RangeRects {

    export function fromElement(element: IHTMLElement): IRangeRect {
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;
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

        readonly pointer: number;
        /**
         * Create a predicate for filtering elements that would be before/after
         * the element in the HTML flow.
         */
        readonly filter: (element: E) => boolean;

        /**
         * Pick the most likely candidate from the items.
         */
        readonly select: (elements: ReadonlyArray<E>) => E | undefined;

    }

    export function create<E extends IHTMLElement>(direction: Direction, boxRect: IRangeRect) {

        return  direction === 'top' ? FluidElementPredicates.createTop<E>(boxRect) :
                                      FluidElementPredicates.createBottom<E>(boxRect);

    }



    export function createTop<E extends IHTMLElement>(boxRect: IRangeRect): IFluidElementPredicate<E> {

        const pointer = boxRect.top;

        function filter(element: E): boolean {
            const elementRect = RangeRects.fromElement(element);
            return RangeRects.contains(boxRect, elementRect)
        }

        function select(elements: ReadonlyArray<E>): E | undefined {
            return Arrays.first(elements);
        }

        return {pointer, filter, select}

    }

    export function createBottom<E extends IHTMLElement>(boxRect: IRangeRect): IFluidElementPredicate<E> {

        const pointer = boxRect.bottom;

        function filter(element: E): boolean {
            const elementRect = RangeRects.fromElement(element);
            return RangeRects.contains(boxRect, elementRect)
        }

        function select(elements: ReadonlyArray<E>): E | undefined {
            return Arrays.last(elements);
        }

        return {pointer, filter, select}

    }

}

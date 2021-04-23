import {IRect} from "polar-shared/src/util/rects/IRect";

export type IThresholds = [number, number];

export namespace TextHighlightMerger {
    // The following values are based on the average height
    export const LINE_HEIGHT_THRESHOLD_PERCENTAGE    = 35 / 100;
    export const LETTER_SPACING_THRESHOLD_PERCENTAGE = 8 / 100;

    export function merge(rects: ReadonlyArray<IRect>): ReadonlyArray<IRect> {
        if (rects.length === 0) {
            return [];
        }

        const lineThresholds = getLineThresholds(rects);
        const blockThresholds = getBlockThresholds(rects);

        const mergeAll = (g: ReadonlyArray<IRect>) => g.reduce(TextHighlightMerger.mergeRects)

        let lines  = TextHighlightMerger.lines(rects, lineThresholds, x => x).map(mergeAll);
        let blocks = TextHighlightMerger.blocks(lines, blockThresholds, x => x).map(mergeAll);
        return blocks;
    }

    export function avgRectsHeight(rects: ReadonlyArray<IRect>): number {
        if (rects.length === 0) {
            return 0;
        }
        return rects.reduce((a, b) => a + b.height, 0) / rects.length;
    }

    export function getWordThresholds(rects: ReadonlyArray<IRect>): IThresholds {
        const avgHeight = avgRectsHeight(rects);

        return [
            avgHeight * LETTER_SPACING_THRESHOLD_PERCENTAGE,
            avgHeight * LINE_HEIGHT_THRESHOLD_PERCENTAGE,
        ];
    }

    export function getLineThresholds(rects: ReadonlyArray<IRect>): IThresholds {
        const avgHeight = avgRectsHeight(rects);

        return [
            Infinity,
            avgHeight * LINE_HEIGHT_THRESHOLD_PERCENTAGE,
        ];
    }

    export function getBlockThresholds(rects: ReadonlyArray<IRect>): IThresholds {
        const avgHeight = avgRectsHeight(rects);

        return [
            avgHeight * LETTER_SPACING_THRESHOLD_PERCENTAGE,
            avgHeight * LINE_HEIGHT_THRESHOLD_PERCENTAGE,
        ];
    }

    export function groupAdjacent<T>(items: ReadonlyArray<T>, fn: (a: T, b: T) => boolean): ReadonlyArray<ReadonlyArray<T>> {

        if (items.length === 0) {
            return [];
        }

        let last          = [items[0]];
        let groups: T[][] = [last];

        for (let i = 1; i < items.length; i += 1) {
            if (fn(items[i - 1], items[i])) {
                last.push(items[i]);
            } else {
                last = [items[i]];
                groups.push(last);
            }
        }

        return groups;
    }

    export function words<T>(items: ReadonlyArray<T>, thresholds: IThresholds, getRect: (a: T) => IRect): ReadonlyArray<ReadonlyArray<T>> {

        return groupAdjacent<T>(items, (a, b) => canMergeX(getRect(a), getRect(b), thresholds));
    }

    export function lines<T>(items: ReadonlyArray<T>, thresholds: IThresholds, getRect: (a: T) => IRect): ReadonlyArray<ReadonlyArray<T>> {
        return groupAdjacent<T>(items, (a, b) => canMergeX(getRect(a), getRect(b), thresholds));
    }

    export function blocks<T>(items: ReadonlyArray<T>, thresholds: IThresholds, getRect: (a: T) => IRect): ReadonlyArray<ReadonlyArray<T>> {
        return groupAdjacent<T>(items, (a, b) => canMergeY(getRect(a), getRect(b), thresholds));
    }

    export function canMergeX(a: IRect, b: IRect, [xt, yt]: IThresholds): boolean {
        return (
            (
                (a.left <= b.left && a.right >= b.left - xt) ||
                (b.left <= a.left && b.right >= a.left - xt)
            ) &&
            // Check if the ractangles are on the same line with some leeway
            Math.abs(a.top - b.top) <= yt &&
            Math.abs(a.bottom - b.bottom) <= yt
        );
    }

    export function canMergeY(a: IRect, b: IRect, [xt, yt]: IThresholds): boolean {
        const val = (
            (
                (a.top <= b.top && a.bottom >= b.top - yt) ||
                (b.top <= a.top && b.bottom >= a.top - yt)
            ) &&
            Math.abs(a.left - b.left) <= xt &&
            Math.abs(a.right - b.right) <= xt
        );
        return val;
    }

    export function mergeRects(a: IRect, b: IRect): IRect {
        const
            top    = Math.min(a.top, b.top),
            bottom = Math.max(a.bottom, b.bottom),
            left   = Math.min(a.left, b.left),
            right  = Math.max(a.right, b.right);

        return {
            top,
            bottom,
            left,
            right,
            width: Math.abs(left - right),
            height: Math.abs(top - bottom)
        };
    }
}

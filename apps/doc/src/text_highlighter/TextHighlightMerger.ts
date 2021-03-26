import {IRect} from "polar-shared/src/util/rects/IRect";

export namespace TextHighlightMerger {
    export const HORIZONTAL_THRESHOLD_PERCENTAGE = 50 / 100;
    export const VERTICAL_THRESHOLD_PERCENTAGE = 40 / 100;

    export function merge(rects: IRect[]) {

        const avgHeight = rects.reduce((a, b) => a + b.height, 1) / rects.length;

        const verticalThreshold = avgHeight * VERTICAL_THRESHOLD_PERCENTAGE;
        const horizontalThreshold = avgHeight * HORIZONTAL_THRESHOLD_PERCENTAGE;

        let last: IRect[] = rects;
        while (true) {
            let merged = TextHighlightMerger
                .groupAdjacent(last, canMerge(verticalThreshold, horizontalThreshold))
                .map(a => a.reduce(TextHighlightMerger.mergeRects));
            if (merged.length === last.length)
                break;
            last = merged;
        }
        return last;
    }

    export function groupAdjacent<T>(items: T[], fn: (a: T, b: T) => boolean): T[][] {
        if (!items.length) return [];
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

    export function canMerge(verticalThreshold: number, horizontalThreshold: number) {
        return (a: IRect, b: IRect) =>
            TextHighlightMerger.canMergeX(a, b, verticalThreshold, horizontalThreshold) ||
            TextHighlightMerger.canMergeY(a, b, verticalThreshold, horizontalThreshold);
    }

    export function canMergeX(a: IRect, b: IRect, verticalThreshold: number, horizontalThreshold: number): boolean {
        return (
            (
                (a.left <= b.left && a.right >= b.left - horizontalThreshold) ||
                (b.left <= a.left && b.right >= a.left - horizontalThreshold)
            ) &&
            // Check if the ractangles are on the same line with some leeway
            Math.abs(a.top - b.top) <= verticalThreshold &&
            Math.abs(a.bottom - b.bottom) <= verticalThreshold
        );
    }

    export function canMergeY(a: IRect, b: IRect, verticalThreshold: number, horizontalThreshold: number): boolean {
        return (
            (
                a.top <= b.top && a.bottom >= b.top - verticalThreshold ||
                b.top <= a.top && b.bottom >= a.top - verticalThreshold
            ) &&
            Math.abs(a.left - b.left) <= horizontalThreshold &&
            Math.abs(a.right - b.right) <= horizontalThreshold
        );
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

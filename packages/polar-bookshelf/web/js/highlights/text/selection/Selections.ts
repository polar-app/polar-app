import {Ranges} from "./Ranges";

export namespace Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     */
    export function toRanges(selection: Selection): ReadonlyArray<Range> {

        // return Numbers.range(0, selection.rangeCount - 1)
        //               .map(selection.getRangeAt);

        const result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {
            // note that we almost always have 1 selection
            const range = selection.getRangeAt(idx);
            result.push(range);
        }

        return result;

    }

    export function hasActiveTextSelection(selection: Selection) {

        const ranges = Selections.toRanges(selection);

        for (const range of ranges) {
            if (Ranges.hasText(range)) {
                return true;
            }
        }

        return false;

    }

}

export namespace Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     */
    export function toRanges(selection: Selection): ReadonlyArray<Range> {

        const result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            const range = selection.getRangeAt(idx);
            result.push(range);

        }

        return result;

    }

}

/**
 *
 */

export class Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     *
     * @param selection {Selection}
     * @return {Array<Range>}
     */
    static toRanges(selection: Selection): Range[] {

        let result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            let range = selection.getRangeAt(idx);
            result.push(range);

        }

        return result;
    }

}

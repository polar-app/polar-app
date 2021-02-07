import {RegExps} from "polar-shared/src/util/RegExps";
import {ISibling, Tuples} from "polar-shared/src/util/Tuples";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace ClozeDeletions {

    /**
     * Parse the number of cloze deletions in the text.
     */
    export function parse(text: string): ReadonlyArray<number> {

        return RegExps.matches(/{{c([0-9]+)/g, text)
                      .map(current => parseInt(current[1]));

    }

    const NEXT_ALLOW_GAPS = false;

    /**
     * Compute the next cloze deletion
     */
    export function next(text: string): number {

        const clozes = [...parse(text)].sort();

        if (clozes.length === 0) {
            // no clozes... easy use case
            return 1;
        }

        function predicate(sibling: ISibling<number>) {

            function computeGap() {

                if (sibling.prev === undefined) {
                    return sibling.curr - 0;
                }

                return sibling.curr - sibling.prev;

            }

            const gap = computeGap();

            return gap > 1;

        }

        if (NEXT_ALLOW_GAPS) {

            const gaps = Tuples.createSiblings(clozes)
                               .filter(predicate);

            if (gaps.length > 0) {
                // we have at least one gap so go with that.
                return gaps[0].prev! + 1;
            }

        }

        return Arrays.last(clozes)! + 1;

    }

}
import {RegExps} from "polar-shared/src/util/RegExps";

export namespace ClozeDeletions {

    /**
     * Parse the number of cloze deletions in the text.
     */
    export function parse(text: string): ReadonlyArray<number> {

        return RegExps.matches(/{{c([0-9]+)/g, text)
                      .map(current => parseInt(current[1]))


    }

}
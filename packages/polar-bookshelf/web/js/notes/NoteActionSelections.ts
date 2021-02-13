import {NoteActions} from "./NoteActions";
import { Arrays } from "polar-shared/src/util/Arrays";

export namespace NoteActionSelections {

    /**
     * Compute a cursor selection based on the current cursor or undefined.
     */
    export function computeCursorRange(): Range | undefined {

        const selection = getSelection();

        if (selection) {

            const range = selection.getRangeAt(0)

            if (range.startContainer === range.endContainer) {

                // cursor detection we have to verify tha the range is over the same
                // start and end container.

                if (range.startOffset === range.endOffset) {

                    // we also have to verify that the start and end ranges are identical

                    return range;

                }

            }

        }

        return undefined;

    }

    export function hasActivePrompt(range: Range): boolean {

        // const text = range.startContainer.nodeValue;
        //
        // if (text === null) {
        //     return false;
        // }
        //
        // const charIndex = range.startOffset - 1;
        //
        // const charAtIndex = text[charIndex];
        //
        // if (charAtIndex !== '/') {
        //     return false;
        // }

        // const prevSibling = Arrays.prevSibling(text, charIndex);
        //
        // if (prevSibling !== undefined && prevSibling !== ' ') {
        //     return false;
        // }
        //
        // const nextSibling = Arrays.nextSibling(text, charIndex);
        //
        // if (nextSibling !== undefined && nextSibling !== ' ') {
        //     return false;
        // }

        return true;

    }

    export function computePromptFromSelection(start: number): string | undefined {

        const range = computeCursorRange();

        if (range !== undefined) {

            const text = range.startContainer.nodeValue;

            if (text !== null) {
                const end = range.startOffset;
                return NoteActions.computePromptFromText(text, start, end)
            }

        }

        return undefined;

    }
}
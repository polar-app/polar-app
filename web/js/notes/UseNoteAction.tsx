import React from 'react';
import {RingBuffers} from "polar-shared/src/util/RingBuffers";
import {NoteActionSelections} from "./NoteActionSelections";
import {useStateRef} from "../hooks/ReactHooks";
import {IActionMenuPosition} from "./NoteActionMenu";

export type ReactKeyboardEventHandler = (event: React.KeyboardEvent) => void;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, IActionMenuPosition | undefined, NoteActionReset];

interface IOpts {

    readonly contenteditable: HTMLElement | null;

    /**
     * The trigger characters that have to fire to bring up the dialog.
     */
    readonly trigger: string;

}

interface ICursorRange {
    readonly node: Node;
    readonly offset: number;
}

// FIXME: then hte region goes backwards, before the trigger point, close the dialog...


// FIXME: desgn, this component controls whether the auto-complete dialog pops up and that's a
// root component for auto-complete that pops up, allows us to type, and can be dismissed as
// I type.
//
// this code is given the metadata for the dialog, and the root store pops it up... and it uses
// mobx for the control / code.

export function useNoteAction(opts: IOpts): NoteActionsResultTuple {

    const {trigger} = opts;

    const keyBuffer = React.useMemo(() => RingBuffers.create(trigger.length), [trigger.length]);

    const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<IActionMenuPosition | undefined>(undefined);

    const triggerPointRef = React.useRef<ICursorRange | undefined>();

    const eventHandler = React.useCallback((event) => {

        keyBuffer.push(event.key);

        const keysTyped = keyBuffer.toArray().join('')

        if (keysTyped === trigger) {

            triggerPointRef.current = computeCursorRange();
            const cursorRange = NoteActionSelections.computeCursorRange();

            if (cursorRange) {

                const bcr = cursorRange.getBoundingClientRect();

                const newPosition = {
                    top: bcr.bottom,
                    left: bcr.left,
                };

                if (newPosition.top !== 0 && newPosition.left !== 0) {
                    setMenuPosition(newPosition);
                }

            }

        }

    }, [keyBuffer, setMenuPosition, trigger]);

    const reset = React.useCallback(() => {

        if (menuPositionRef.current !== undefined) {
            // the menu must go away now ... [
            setMenuPosition(undefined);
        }

        triggerPointRef.current = undefined;

    }, [menuPositionRef, setMenuPosition])

    return [eventHandler, menuPosition, reset];

}

function computeCursorRange(): ICursorRange {

    const sel = window.getSelection();

    if (sel) {

        if (sel.rangeCount > 0) {

            const range = sel.getRangeAt(0);

            return {
                node: range.startContainer,
                offset: range.startOffset
            }

        }

    }

    throw new Error("No range point");

}

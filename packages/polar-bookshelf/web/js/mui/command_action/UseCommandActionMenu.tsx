import React from 'react';
import {RingBuffers} from "polar-shared/src/util/RingBuffers";
import {
    CommandActionMenuItemProvider,
    ICommandActionMenuPosition,
    useCommandActionMenuStore
} from "./CommandActionMenuStore";
import {useStateRef} from "../../hooks/ReactHooks";
import {NoteActionSelections} from "../../notes/NoteActionSelections";

export type ReactKeyboardEventHandler = (event: React.KeyboardEvent) => void;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, ICommandActionMenuPosition | undefined, NoteActionReset];

interface IOpts {

    readonly contenteditable: HTMLElement | null;

    /**
     * The trigger characters that have to fire to bring up the dialog.
     */
    readonly trigger: string;


    // /**
    //  * The provider for the commands which we filter for when computing the
    //  * prompt and then set in the store.
    //  */
    // readonly itemsProvider: CommandActionMenuItemProvider;

}

interface ICursorRange {
    readonly node: Node;
    readonly offset: number;
}

export function useCommandActionMenu(opts: IOpts): NoteActionsResultTuple {

    const {trigger} = opts;

    const store = useCommandActionMenuStore();

    const keyBuffer = React.useMemo(() => RingBuffers.create(trigger.length), [trigger.length]);

    const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<ICommandActionMenuPosition | undefined>(undefined);

    const triggerPointRef = React.useRef<ICursorRange | undefined>();

    // FIXME: split around the cursor... as the prefix and text...

    const eventHandler = React.useCallback((event) => {

        keyBuffer.push(event.key);

        const keysTyped = keyBuffer.toArray().join('')

        console.log("FIXME: keysTyped: ", keysTyped)

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

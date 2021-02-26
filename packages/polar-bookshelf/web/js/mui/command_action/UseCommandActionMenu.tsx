import React from 'react';
import {
    CommandActionMenuItemProvider,
    ICommandActionMenuPosition,
    useCommandActionMenuStore
} from "./CommandActionMenuStore";
import {useStateRef} from "../../hooks/ReactHooks";
import {ContentEditables} from "../../notes/ContentEditables";

export type ReactKeyboardEventHandler = (event: React.KeyboardEvent, contenteditable: HTMLElement | null) => void;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, ICommandActionMenuPosition | undefined, NoteActionReset];

interface IOpts {

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

    const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<ICommandActionMenuPosition | undefined>(undefined);

    const triggerPointRef = React.useRef<ICursorRange | undefined>();

    // FIXME: split around the cursor... as the prefix and text...

    const eventHandler = React.useCallback((event, contenteditable) => {

        if (! contenteditable) {
            console.log("FIXME1");
            return;
        }

        const split = ContentEditables.splitAtCursor(contenteditable)

        if (! split) {
            console.log("FIXME2");
            return;
        }

        const splitText = ContentEditables.fragmentToText(split.prefix);

        if (splitText.endsWith(trigger)) {

            console.log("FIXME: triggered");

            // triggerPointRef.current = computeCursorRange();
            // const cursorRange = NoteActionSelections.computeCursorRange();
            //
            // if (cursorRange) {
            //
            //     const bcr = cursorRange.getBoundingClientRect();
            //
            //     const newPosition = {
            //         top: bcr.bottom,
            //         left: bcr.left,
            //     };
            //
            //     if (newPosition.top !== 0 && newPosition.left !== 0) {
            //         setMenuPosition(newPosition);
            //     }
            //
            // }

        }

    }, [trigger]);

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

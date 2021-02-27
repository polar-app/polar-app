import React from 'react';
import {
    ActionMenuItemsProvider,
    useActionMenuStore
} from "./ActionStore";
import {ContentEditables} from "../../notes/ContentEditables";
import {NoteActionSelections} from "../../notes/NoteActionSelections";
import {IDStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

/**
 * Keyboard handler for while the user types. We return true if the menu is active.
 */
export type ReactKeyboardEventHandler = (event: React.KeyboardEvent, contenteditable: HTMLElement | null) => boolean;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, NoteActionReset];

// TODO: need operations for bold, italics, and any other type of action we want
// to perform here.

/**
 * Link to a node.
 */
export interface IActionOpWithNodeLink {
    readonly type: 'node-link';
    readonly target: string;
}

export type ActionOp = IActionOpWithNodeLink;

/**
 * Given an id for the action to, perform the given operation.
 */
export type ActionHandler = (id: IDStr) => ActionOp;

interface IOpts {

    /**
     * The trigger characters that have to fire to bring up the dialog.
     */
    readonly trigger: string;

    /**
     * The provider for the commands which we filter for when computing the
     * prompt and then set in the store.
     */
    readonly itemsProvider: ActionMenuItemsProvider;

    /**
     * Execute the action
     */
    readonly onAction: ActionHandler;

}

function useActionExecutor() {

    return React.useCallback((from: Range, to: Range, action: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();
            range.setStart(from.startContainer, from.startOffset);
            range.setEnd(from.endContainer, from.endOffset);
            return range;
        }

        switch (action.type) {

            case "node-link":

                const coveringRange = createCoveringRange();
                coveringRange.deleteContents();

                const a = document.createElement('a');
                a.setAttribute("href", "#" + action.target);
                a.appendChild(document.createTextNode(action.target));
                coveringRange.insertNode(a);

                break;

        }

    }, [])

}

// FIXME how do we replace /execute the action to replace the text? I could use
// the range API for this, replace the text in that range with a document
// fragment then emit the new content as markdown

// FIXME: now the main issue is I have to patch the DOM and build the
// replacement...

export function useActions(opts: IOpts): NoteActionsResultTuple {

    const {trigger, itemsProvider} = opts;

    const store = useActionMenuStore();
    const actionExecutor = useActionExecutor();

    const activeRef = React.useRef(false);

    const textAtTriggerPointRef = React.useRef("");

    const reset = React.useCallback(() => {

        activeRef.current = false;
        store.setState(undefined);

        return false;

    }, [store])

    const actionHandler = React.useCallback((id: IDStr) => {

        reset();

    }, [reset]);

    const eventHandler = React.useCallback((event, contenteditable): boolean => {

        if (! contenteditable) {
            return false;
        }

        const split = ContentEditables.splitAtCursor(contenteditable)

        if (! split) {
            return false;
        }

        const prefixText = ContentEditables.fragmentToText(split.prefix);

        function hasPrompt(): boolean {
            return prefixText.length >= textAtTriggerPointRef.current.length;
        }

        function computePrompt(): string {
            return prefixText.substr(textAtTriggerPointRef.current.length);
        }

        if (activeRef.current) {

            const prompt = computePrompt();

            if (! hasPrompt()) {
                return reset();
            }

            if (event.key === 'Escape') {
                return reset();
            }

            const items = itemsProvider(prompt);
            store.updateState(items);

        } else {

            if (prefixText.endsWith(trigger)) {

                textAtTriggerPointRef.current = prefixText;

                const prompt = computePrompt();

                function computePosition() {

                    const cursorRange = NoteActionSelections.computeCursorRange();

                    if (cursorRange) {

                        const bcr = cursorRange.getBoundingClientRect();

                        const newPosition = {
                            bottom: bcr.top,
                            top: bcr.bottom,
                            left: bcr.left,
                        };

                        if (newPosition.top !== 0 && newPosition.left !== 0) {
                            return newPosition;
                        }
                    }

                    return undefined;

                }

                const position = computePosition();

                if (position) {

                    activeRef.current = true;

                    const actions = itemsProvider(prompt);

                    store.setState({
                        position,
                        actions,
                        onAction: NULL_FUNCTION
                    });

                }

            }

        }

        return activeRef.current;

    }, [itemsProvider, reset, store, trigger]);

    return [eventHandler, reset];

}

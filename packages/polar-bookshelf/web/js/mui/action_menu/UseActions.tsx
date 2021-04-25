import React from 'react';
import {
    ActionMenuItemsProvider,
    useActionMenuStore
} from "./ActionStore";
import {ContentEditables} from "../../notes/ContentEditables";
import {NoteActionSelections} from "../../notes/NoteActionSelections";
import {IDStr} from "polar-shared/src/util/Strings";
import INodeOffset = ContentEditables.INodeOffset;
import useTheme from '@material-ui/core/styles/useTheme';

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
    readonly type: 'note-link';
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
    readonly actionsProvider: ActionMenuItemsProvider;

    /**
     * Execute the action
     */
    readonly onAction: ActionHandler;

}

function useActionExecutor() {

    return React.useCallback((from: INodeOffset, to: INodeOffset, actionOp: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();
            range.setStart(from.node, from.offset);
            range.setEnd(to.node, to.offset);
            return range;
        }

        switch (actionOp.type) {

            case "note-link":

                const coveringRange = createCoveringRange();
                coveringRange.deleteContents();

                const a = document.createElement('a');
                a.setAttribute("href", "#" + actionOp.target);
                a.appendChild(document.createTextNode(actionOp.target));
                coveringRange.insertNode(a);

                window.getSelection()!.getRangeAt(0).setStartAfter(a);
                window.getSelection()!.getRangeAt(0).setEndAfter(a);

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

    const theme = useTheme();

    const {trigger, actionsProvider, onAction} = opts;

    const store = useActionMenuStore();
    const actionExecutor = useActionExecutor();

    const activeRef = React.useRef(false);

    const textAtTriggerPointRef = React.useRef("");

    const triggerPointNodeOffsetRef = React.useRef<INodeOffset | undefined>(undefined);

    const reset = React.useCallback(() => {

        activeRef.current = false;
        triggerPointNodeOffsetRef.current = undefined;
        textAtTriggerPointRef.current = '';

        store.setState(undefined);

        return false;

    }, [store])

    const actionHandler = React.useCallback((id: IDStr) => {

        const actionOp = onAction(id);

        function computeFrom() {
            return {
                node: triggerPointNodeOffsetRef.current!.node,
                offset: triggerPointNodeOffsetRef.current!.offset - trigger.length
            };
        }

        function computeTo() {
            const range = window.getSelection()!.getRangeAt(0);
            return {
                node: range.startContainer,
                offset: range.startOffset
            }
        }

        const from = computeFrom();
        const to = computeTo();

        actionExecutor(from, to, actionOp);

        reset();

    }, [actionExecutor, onAction, reset, trigger.length]);

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

            const items = actionsProvider(prompt);
            store.updateState(items);

        } else {

            if (prefixText.endsWith(trigger)) {

                // FIXME end it with ]]

                // ***
                // - active prompt behavior
                //   - if the cursor leaves the note the action is finished
                //   - what happens if the user types something in the [[ or ]] like changes
                //     the text to something like [a[ ... it should break that text but if they
                //     rejoin it then it should go back to being active.

                function createActivePrompt() {

                    // FIXME: when we wrap it, it resets the cursor
                    //
                    const sel = window.getSelection();

                    // FIXME we will need a canonicalization function to rip the
                    // note-action out.
                    if (sel) {

                        function createBracketSpan(text: string, className: string) {
                            const span = document.createElement('span');
                            span.setAttribute('class', className);
                            span.setAttribute('style', `padding-left: 2px; padding-right: '2px`);
                            // span.setAttribute('style', `color: ${theme.palette.text.hint}; padding-left: 2px; padding-right: '2px`);
                            span.textContent = text;
                            return span;
                        }

                        // FIXME: make the brackets a more mild color...

                        // FIXME: deleteContents...

                        const range = sel.getRangeAt(0);
                        const wrapRange = document.createRange();
                        wrapRange.setStart(range.startContainer, range.startOffset - 2);
                        wrapRange.setEnd(range.endContainer, range.endOffset);

                        // const newParent = document.createElement('span');
                        // newParent.setAttribute('class', 'action');

                        wrapRange.deleteContents();

                        const actionRight = createBracketSpan(']]', 'action-right');
                        const actionLeft = createBracketSpan('[[', 'action-left');
                        wrapRange.insertNode(actionRight);
                        wrapRange.insertNode(actionLeft);

                        // FIXMEL bnot we're typing in the span
                        range.setStartBefore(actionRight);
                        range.setStartAfter(actionLeft);

                    }

                }

                createActivePrompt();

                textAtTriggerPointRef.current = prefixText;

                function computeNodeOffsetFromSelection() {
                    const range = document.getSelection()!.getRangeAt(0);
                    return {
                        node: range.startContainer,
                        offset: range.startOffset
                    }
                }

                triggerPointNodeOffsetRef.current = computeNodeOffsetFromSelection();

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

                    const items = actionsProvider(prompt);

                    store.setState({
                        position,
                        items,
                        onAction: actionHandler
                    });

                }

            }

        }

        return activeRef.current;

    }, [actionHandler, actionsProvider, reset, store, trigger]);

    return [eventHandler, reset];

}

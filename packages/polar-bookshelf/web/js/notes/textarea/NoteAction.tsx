import React from 'react';
import {IDStr} from "polar-shared/src/util/Strings";
import useTheme from '@material-ui/core/styles/useTheme';
import {ActionMenuItemsProvider, useActionMenuStore} from "../../mui/action_menu/ActionStore";
import {ContentEditables} from "../ContentEditables";
import INodeOffset = ContentEditables.INodeOffset;
import {useNoteContentEditableElement} from "./NoteContentEditable";
import { observer } from "mobx-react-lite"

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

interface IProps {

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

    readonly children: JSX.Element;
}

/**
 * Performs teh action DOM mutation based on the type of action.
 */
function useActionExecutor() {

    return React.useCallback((from: INodeOffset, to: INodeOffset, actionOp: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();

            // TODO technically we don't need the offset here.
            range.setStartBefore(from.node);
            range.setEndAfter(to.node);

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

/**
 * Represents a prompt range with two spans for left and right and an input in the middle.
 */
interface ActivePrompt {

    /**
     * The range for where to place the calculate the position for the menu.
     */
    readonly positionRange: Range;

    readonly actionLeft: HTMLSpanElement;

    readonly actionRight: HTMLSpanElement;

    readonly actionInput: HTMLSpanElement;

}


// FIXME: next steps
//
// - ability to have a specific method to read the input....

export const NoteAction = observer((props: IProps) => {

    const theme = useTheme();

    const {trigger, actionsProvider, onAction} = props;

    const store = useActionMenuStore();
    const actionExecutor = useActionExecutor();

    // true when the current prompt is active and we're actively selecting or
    // creating a new note by typing in the prompt
    const activeRef = React.useRef(false);

    const divRef = useNoteContentEditableElement();

    const activePromptRef = React.useRef<ActivePrompt | undefined>(undefined);

    const clearActivePrompt = React.useCallback(() => {

        if (! activePromptRef.current) {
            return;
        }

        const range = document.createRange();

        range.setStartBefore(activePromptRef.current.actionLeft);
        range.setEndAfter(activePromptRef.current.actionRight);

        range.deleteContents();

    }, []);

    const reset = React.useCallback(() => {

        clearActivePrompt();

        activeRef.current = false;

        activePromptRef.current = undefined;

        store.setState(undefined);

        return false;

    }, [clearActivePrompt, store])

    // FIXME: if we jus type Shift or Command or any special key, then lift up, it's considered a valid input.

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (! divRef.current) {
            return false;
        }

        const split = ContentEditables.splitAtCursor(divRef.current)

        if (! split) {
            return false;
        }

        const prefixText = ContentEditables.fragmentToText(split.prefix);

        function hasActionInputText(): boolean {
            return activePromptRef.current?.actionInput.textContent?.length !== 0;
        }

        function computeActionInputText(): string {
            return activePromptRef.current?.actionInput.textContent || '';
        }

        if (activeRef.current) {

            const prompt = computeActionInputText();

            const items = actionsProvider(prompt);
            store.updateState(items);

            // FIXME use the actionHandler here that we've created when the user hits enter...

            if (event.key === 'Escape') {
                reset();
            }

        } else {

            if (prefixText.endsWith(trigger)) {

                /**
                 * Create the active input prompt and return a range where the menu must popup.
                 */
                function createActivePrompt(): ActivePrompt {

                    const sel = window.getSelection();

                    if (sel) {

                        function createBracketSpan(text: string, className: string) {
                            const span = document.createElement('span');
                            span.setAttribute('class', className);
                            span.setAttribute('contenteditable', 'false');
                            span.setAttribute('style', `padding-left: 3px; padding-right: 3px; font-face: fixed; color: ${theme.palette.text.hint};`);
                            span.textContent = text;
                            return span;
                        }

                        function createInputSpan() {
                            const span = document.createElement('span');
                            span.setAttribute('class', 'action-input');
                            return span;
                        }

                        const range = sel.getRangeAt(0);

                        const wrapRange = document.createRange();
                        wrapRange.setStart(range.startContainer, range.startOffset - 2);
                        wrapRange.setEnd(range.endContainer, range.endOffset);

                        wrapRange.deleteContents();

                        const actionRight = createBracketSpan(']]', 'action-right');
                        const actionLeft = createBracketSpan('[[', 'action-left');
                        const actionInput = createInputSpan();

                        wrapRange.insertNode(actionRight);
                        wrapRange.insertNode(actionInput);
                        wrapRange.insertNode(actionLeft);

                        range.setStart(actionInput, 0);
                        range.setEnd(actionInput, 0);

                        function createPositionRange() {
                            const range = document.createRange();
                            range.setStart(actionLeft.firstChild!, 1);
                            range.setEnd(actionLeft.firstChild!, 1);
                            return range;
                        }

                        const positionRange = createPositionRange();

                        return {
                            positionRange,
                            actionLeft,
                            actionRight,
                            actionInput
                        }

                    }

                    throw new Error("No selection");

                }

                activePromptRef.current = createActivePrompt();

                const prompt = computeActionInputText();

                function computePosition() {

                    if (activePromptRef.current?.positionRange) {

                        const bcr = activePromptRef.current.positionRange.getBoundingClientRect();

                        const newPosition = {
                            bottom: bcr.top,
                            top: bcr.bottom,
                            left: bcr.left,
                        };

                        if (newPosition.top !== 0 && newPosition.left !== 0) {
                            return newPosition;
                        } else {
                            console.warn("Invalid position ", newPosition);
                        }

                    } else {
                        console.warn("computePosition has no cursor range");
                    }

                    return undefined;

                }

                function createActionHandler() {

                    return (id: IDStr) => {

                        const actionOp = onAction(id);

                        function computeFrom() {
                            return {
                                node: activePromptRef.current!.actionLeft,
                                offset: 0
                            };
                        }

                        function computeTo() {
                            return {
                                node: activePromptRef.current!.actionRight,
                                offset: 1
                            }
                        }

                        const from = computeFrom();
                        const to = computeTo();

                        actionExecutor(from, to, actionOp);

                        reset();

                    }

                }

                const position = computePosition();
                const actionHandler = createActionHandler();

                if (position) {

                    activeRef.current = true;

                    const actions = actionsProvider(prompt);

                    store.setState({
                        position,
                        actions,
                        onAction: actionHandler
                    });

                } else {
                    console.warn("No position for menu");
                }

            }

        }

        return activeRef.current;

    }, [actionExecutor, actionsProvider, divRef, onAction, reset, store, theme.palette.text.hint, trigger]);

    return (
        <div onKeyUp={handleKeyUp}>
            {props.children}
        </div>
    );

});


import React from 'react';
import {IDStr} from "polar-shared/src/util/Strings";
import useTheme from '@material-ui/core/styles/useTheme';
import {ActionMenuItemsProvider, useActionMenuStore} from "../../mui/action_menu/ActionStore";
import {ContentEditables} from "../ContentEditables";
import INodeOffset = ContentEditables.INodeOffset;
import {useNoteContentEditableElement} from "./NoteContentEditable";
import { observer } from "mobx-react-lite"

const THINSP = ' ';

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

    readonly actionInput: HTMLSpanElement;

}


// FIXME: next steps
//
// - entering one character, then hitting backspace twice, deletes all of the text
// - having a smaller contenteditable=false INSIDE cause some weird bugs...
//    - instead, what we could do, is see if the user is mutating the actionLeft span and abort it OR if they hit
//    - delete within that span then we have to delete the whole span and reset.

export const NoteAction = observer((props: IProps) => {

    const theme = useTheme();

    const {trigger, actionsProvider, onAction} = props;

    const actionStore = useActionMenuStore();
    const actionExecutor = useActionExecutor();

    // true when the current prompt is active and we're actively selecting or
    // creating a new note by typing in the prompt
    const activeRef = React.useRef(false);

    const divRef = useNoteContentEditableElement();

    const activePromptRef = React.useRef<ActivePrompt | undefined>(undefined);

    const computeItems = React.useCallback((prompt: string) => {

        return [...(prompt.length === 0 ? [] : actionsProvider(prompt))]
               .sort((a, b) => a.text.localeCompare(b.text))

    }, [actionsProvider])

    const clearActivePrompt = React.useCallback(() => {

        if (! activePromptRef.current) {
            return;
        }

        activePromptRef.current.actionInput.innerText = '[[';

    }, []);

    const reset = React.useCallback(() => {

        if (activeRef.current) {

            clearActivePrompt();

            activeRef.current = false;

            activePromptRef.current = undefined;

            actionStore.setState(undefined);

        }

    }, [clearActivePrompt, actionStore])


    const hasAborted = React.useCallback((event: React.KeyboardEvent): boolean => {

        if (! activePromptRef.current) {
            return true;
        }

        if (! activePromptRef.current.actionInput.parentElement) {
            return true;
        }

        const actionText = activePromptRef.current.actionInput.textContent || '';

        if (! actionText.startsWith(`[[${THINSP}`)) {
            console.log("Aborted: left");
            return true;
        }

        if (! actionText.endsWith(`${THINSP}]]`)) {
            console.log("Aborted: right");
            return true;
        }

        return false;

    }, []);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // const range = window.getSelection()?.getRangeAt(0);
        //
        // if (range) {
        //
        //     if (activePromptRef.current) {
        //
        //         if (range.startContainer === activePromptRef.current.actionLeft ||
        //             range.startContainer === activePromptRef.current.actionRight) {
        //
        //
        //             event.stopPropagation();
        //             event.preventDefault();
        //
        //         }
        //
        //     }
        //
        // }

    }, []);

    const createActionRangeForHandler = React.useCallback(() => {

        function computeFrom() {
            return {
                node: activePromptRef.current!.actionInput,
                offset: 0
            };
        }

        function computeTo() {
            return {
                node: activePromptRef.current!.actionInput,
                offset: (activePromptRef.current!.actionInput.textContent || '').length
            }
        }

        const from = computeFrom();
        const to = computeTo();

        return {from, to};

    }, []);

    const createActionHandler = React.useCallback(() => {

        return (id: IDStr) => {

            const actionOp = onAction(id);

            const {from, to} = createActionRangeForHandler()

            actionExecutor(from, to, actionOp);

            reset();

        }

    }, [actionExecutor, createActionRangeForHandler, onAction, reset]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (! divRef.current) {
            return;
        }

        const split = ContentEditables.splitAtCursor(divRef.current)

        if (! split) {
            return;
        }

        const prefixText = ContentEditables.fragmentToText(split.prefix);

        function hasActionInputText(): boolean {
            return activePromptRef.current?.actionInput.textContent?.length !== 0;
        }

        function computeActionInputText(): string {

            return (activePromptRef.current?.actionInput.textContent || '')
                .replace(/^\[\[./, '')
                .replace(/.\]\]$/, '');

        }

        if (activeRef.current) {

            const prompt = computeActionInputText();

            if (hasAborted(event)) {
                reset();
            }

            switch (event.key) {
                case 'Escape':
                    reset();
                    break;

                case 'Enter':
                    const {from, to} = createActionRangeForHandler()

                    actionExecutor(from, to, {
                        type: 'note-link',
                        target: prompt
                    });

                    reset();
                    break;
            }

            const items = computeItems(prompt);
            actionStore.updateState(items);

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
                            span.setAttribute('style', `color: ${theme.palette.text.hint};`);

                            const textNode = document.createTextNode(text);
                            span.appendChild(textNode);
                            return span;
                        }

                        function createInputSpan() {

                            const span = document.createElement('span');
                            span.setAttribute('class', 'action-input');

                            const textNode = document.createTextNode(`[[${THINSP}${THINSP}]]`);
                            span.appendChild(textNode);

                            return span;
                        }

                        const range = sel.getRangeAt(0);

                        const wrapRange = document.createRange();
                        wrapRange.setStart(range.startContainer, range.startOffset - 2);
                        wrapRange.setEnd(range.endContainer, range.endOffset);

                        wrapRange.deleteContents();

                        const actionInput = createInputSpan();

                        wrapRange.insertNode(actionInput);

                        range.setStart(actionInput.firstChild!, 3);
                        range.setEnd(actionInput.firstChild!, 3);

                        function createPositionRange() {
                            const range = document.createRange();
                            range.setStart(actionInput.firstChild!, 3);
                            range.setEnd(actionInput.firstChild!, 3);
                            return range;
                        }

                        const positionRange = createPositionRange();

                        return {
                            positionRange,
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

                const position = computePosition();
                const actionHandler = createActionHandler();

                if (position) {

                    activeRef.current = true;

                    const items = computeItems(prompt);

                    actionStore.setState({
                        position,
                        items,
                        onAction: actionHandler
                    });

                } else {
                    console.warn("No position for menu");
                }

            }

        }

        return activeRef.current;

    }, [divRef, hasAborted, computeItems, actionStore, reset, createActionRangeForHandler, actionExecutor, trigger, createActionHandler, theme.palette.text.hint]);


    const handleClick = React.useCallback(() => {
        reset();
    }, [reset]);

    return (
        <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onClick={handleClick}>
            {props.children}
        </div>
    );

});


import React from 'react';
import {IDStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {createActionsProvider, useActionMenuStore} from "../../mui/action_menu/ActionStore";
import {ContentEditables} from "../ContentEditables";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "./DOMBlocks";
import {useBlocksUserTagsDB} from "../../../../apps/repository/js/persistence_layer/BlocksUserTagsDataLoader";
import {BlockPredicates} from '../store/BlockPredicates';
import {TAG_IDENTIFIER} from '../content/HasLinks';
import {useBlocksStore} from '../store/BlocksStore';
import {BlockTextContentUtils} from "../BlockTextContentUtils";
import INodeOffset = ContentEditables.INodeOffset;

/**
 * Keyboard handler for while the user types. We return true if the menu is active.
 */
export type ReactKeyboardEventHandler = (event: React.KeyboardEvent, contenteditable: HTMLElement | null) => boolean;

export type NoteActionReset = () => void;

export type NoteActionsResultTuple = [ReactKeyboardEventHandler, NoteActionReset];

// TODO: need operations for bold, italics, and any other type of action we want
// to perform here.

export interface IActionTypeWithBlockLink {
    readonly type: "block-link";
    readonly target: string;
}

/**
 * Link to a node.
 */
export interface IActionOpWithBlockLink extends IActionTypeWithBlockLink {
    readonly undoContent: MarkdownStr;
}

export interface IActionTypeWithBlockTag {
    readonly type: "block-tag";
    readonly target: string;
}

export interface IActionOpWithBlockTag extends IActionTypeWithBlockTag {
    readonly undoContent: MarkdownStr;
}

export type ActionOp = IActionOpWithBlockLink | IActionOpWithBlockTag;

export type ActionType = IActionTypeWithBlockLink | IActionTypeWithBlockTag;

/**
 * Given an id for the action to, perform the given operation.
 */
export type ActionHandler = (id: IDStr) => ActionType;

interface IAction {
    readonly wrapStart: string;

    readonly wrapEnd: string;

    /**
     * The trigger characters that have to fire to bring up the dialog.
     */
    readonly trigger: string;

    readonly type: ActionType['type'];
}

export const BLOCK_LINK_ACTION: IAction = {
    trigger: '[[',
    wrapStart: '[[ ',
    wrapEnd: ' ]]',
    type: 'block-link',
};

export const BLOCK_TAG_ACTION: IAction = {
    trigger: '#',
    wrapStart: '#',
    wrapEnd: '',
    type: 'block-tag',
};

const ACTIONS: IAction[] = [
    BLOCK_LINK_ACTION,
    BLOCK_TAG_ACTION,
];

/**
 * Performs teh action DOM mutation based on the type of action.
 */
function useActionExecutor() {

    const blocksStore = useBlocksStore();
    const blocksUserTagsDB = useBlocksUserTagsDB();

    const contentEditableMarkdownReader = useContentEditableMarkdownReader();

    return React.useCallback((id: BlockIDStr, from: INodeOffset, to: INodeOffset, actionOp: ActionOp) => {

        function createCoveringRange(): Range {
            const range = document.createRange();

            // TODO technically we don't need the offset here.
            range.setStartBefore(from.node);
            range.setEndAfter(to.node);

            return range;
        }

        function createLink(type: DOMBlocks.IWikiLinkType, target: string) {
            const updateSelection = () => {

                const coveringRange = createCoveringRange();
                coveringRange.deleteContents();

                const a = DOMBlocks.createWikiLinkAnchorElement(type, target);


                coveringRange.insertNode(a);
            };

            updateSelection();

            const content = contentEditableMarkdownReader(id);
            const targetID = blocksStore.createLinkToBlock(id, target, content);
            const targetBlock = blocksStore.getBlock(targetID);

            if (type === 'tag' && targetBlock && BlockPredicates.isNamedBlock(targetBlock)) {
                blocksUserTagsDB.register({
                    id: targetID,
                    label: BlockTextContentUtils.getTextContentMarkdown(targetBlock.content)
                });
                blocksUserTagsDB.commit().catch(console.error);
            }
        }

        switch (actionOp.type) {

            case "block-link":
                createLink('link', actionOp.target);
                break;

            case "block-tag":
                createLink('tag', `${TAG_IDENTIFIER}${actionOp.target}`);
                break;

        }

    }, [contentEditableMarkdownReader, blocksUserTagsDB, blocksStore])

}

function useContentEditableMarkdownReader() {

    return React.useCallback((id: BlockIDStr) => {

        const blockElement = DOMBlocks.getBlockElement(id);

        if (! blockElement) {
            throw new Error('Block was not found');
        }

        const converter = MarkdownContentConverter;
        const div = blockElement.cloneNode(true) as HTMLElement;
        const html = div.innerHTML;
        return converter.toMarkdown(html);
    }, []);
}

export namespace BlockActionUtils {

    type ITriggerActionOpts = {
        /**
         * The element where the action prompt will be added
         */
        readonly elem: HTMLElement;

        /**
         * The action that the action prompt will perform
         */
        readonly action: IAction;

        /**
         * A callback that gets fired when the action prompt gets cancelled
         */
        readonly onCancel: (noRange?: boolean) => void;

        /**
         * A callback that gets fired when the action prompt is confirmed
         */
        readonly onComplete: (text: string) => void;

        /**
         * A callback that gets fired when the text contents of the action prompt changes
         */
        readonly onActionInputChange: (text: string) => void;
    };

    /**
     * Compute the position on screen of an element
     */
    function computePosition(elem: HTMLElement) {
        const bcr = elem.getBoundingClientRect();

        return {
            bottom: bcr.top,
            top: bcr.bottom,
            left: bcr.left,
        };
    }


    type IActionInput = {

        actionInput: HTMLElement,

        computeActionInputText: () => string,
    };

    /**
     * Create an action prompt that the user can type into
     *
     * @param elem The element where the prompt will be inserted
     * @param action The type of the action that the prompt will complete when it's confirmed
     */
    function createActivePrompt(elem: HTMLElement, action: IAction): IActionInput | undefined {
        const { wrapStart, wrapEnd, trigger } = action;

        const range = ContentEditables.currentRange();

        if (! range) {
            console.warn('No selection: could not create active prompt');
            return;
        }

        // Delete the existing trigggers if any
        const split = ContentEditables.splitAtCursor(elem);

        if (! split) {
            console.warn('No selection. could not calculate split');
            return;
        }

        const prefix = ContentEditables.fragmentToText(split.prefix);
        const wrapRange = new Range();

        wrapRange.setStart(
            range.startContainer,
            prefix.endsWith(trigger) ? range.startOffset - trigger.length : range.startOffset
        );
        wrapRange.setEnd(range.endContainer, range.endOffset);
        wrapRange.deleteContents();


        // Create the input span
        const actionInput = document.createElement('span');
        actionInput.setAttribute('class', 'action-input');

        const textNode = document.createTextNode(`${wrapStart}${wrapEnd}`);
        actionInput.appendChild(textNode);

        wrapRange.insertNode(actionInput);


        range.setStart(actionInput.firstChild!, wrapStart.length);
        range.setEnd(actionInput.firstChild!, wrapStart.length);

        const computeActionInputText = () => {
            const text = actionInput.textContent || '';

            return text.slice(wrapStart.length, text.length - wrapEnd.length);
        };

        return {
            actionInput,
            computeActionInputText,
        };
    }

    /**
     * Clears the action prompt if any
     *
     * @param action The action that the active action prompt was created for
     * @param actionInput The currently active action prompt
     */
    export function clearActivePrompt(action: IAction, actionInput: IActionInput, noRange?: boolean) {
        const elem = actionInput.actionInput;

        if (! elem.parentElement) {
            return;
        }

        const promptText = actionInput.computeActionInputText() || action.wrapStart;

        const replaceRange = document.createRange();
        replaceRange.setStartBefore(elem);
        replaceRange.setEndAfter(elem);

        replaceRange.deleteContents();
        replaceRange.insertNode(document.createTextNode(promptText));

        if (! noRange) {
            const range = ContentEditables.currentRange();

            if (! range) {
                return;
            }

            range.setStart(replaceRange.endContainer, replaceRange.endOffset);
            range.setEnd(replaceRange.endContainer, replaceRange.endOffset);
        }
    }

    /**
     * Get the initial markdown content of the contentEditable element of a block
     * (without the text within the currently active action input)
     *
     * @param elem The contentEditable element where the action input is currently at
     */
    function getInitialMarkdownContent(elem: HTMLElement) {
        const div = elem.cloneNode(true) as HTMLElement;
        div.querySelector('.action-input')!.outerHTML = '';
        const html = div.innerHTML;
        return MarkdownContentConverter.toMarkdown(html);
    }

    /**
     * Check if the user's caret is currently within an action prompt
     *
     * @param action The action of the currently active action input
     * @param actionInput The currently active action input
     * @param delta A delta value of the change in the position of the text cursor
     */
    function cursorWithinActionInput(action: IAction, actionInput: IActionInput, delta: number = 0): boolean {

        function createInputRange() {

            const inputEnd = ContentEditables.computeEndNodeOffset(actionInput.actionInput);

            const inputRange = document.createRange();

            inputRange.setStart(actionInput.actionInput.firstChild!, action.wrapStart.length);
            inputRange.setEnd(inputEnd.node, inputEnd.offset - action.wrapEnd.length);

            return inputRange;

        }

        const inputRange = createInputRange();

        const range = ContentEditables.currentRange();

        if (! range) {
            return false;
        }

        const actualDelta = range.collapsed ? delta : 0;

        return inputRange.isPointInRange(range.startContainer, range.startOffset + actualDelta) &&
               inputRange.isPointInRange(range.endContainer, range.endOffset + actualDelta);
    }

    /**
     * Create a range that surrounds the action prompt
     *
     * @param actionInput The currently active action input
     */
    function createActionRangeForHandler({ actionInput }: IActionInput) {
        const computeFrom = () => ({
            node: actionInput,
            offset: 0
        });

        const computeTo = () => ({
            node: actionInput,
            offset: (actionInput.textContent || '').length
        });

        const from = computeFrom();
        const to = computeTo();

        return {from, to};
    }

    /**
     * Trigger a certain block action prompt
     *
     * @param opts @see ITriggerActionOpts
     */
    export function triggerAction(opts: ITriggerActionOpts) {
        const { elem, action, onCancel, onComplete, onActionInputChange } = opts;

        const actionInput = createActivePrompt(elem, action);

        if (! actionInput) {
            return;
        }

        const promptText = actionInput.computeActionInputText();
        const position = computePosition(actionInput.actionInput);
        const initialMarkdown = getInitialMarkdownContent(elem);

        onActionInputChange(promptText);

        const doCompleteOrCancel = () => {
            const text = actionInput.computeActionInputText();

            if (text.length === 0) {
                doCancel();
            } else {
                onComplete(text);
            }
        };

        const doCancel = (noRange?: boolean) => {
            elem.removeEventListener('keydown', handleKeyDown);
            elem.removeEventListener('click', handleClick);
            elem.removeEventListener('input', handleInput);
            clearActivePrompt(action, actionInput, noRange);

            onCancel();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const computeDelta = (): number => {
                switch (event.key) {
                    case 'ArrowLeft':
                        return -1;

                    case 'Backspace':
                        return -1;

                    case 'ArrowRight':
                        return 1;

                    default:
                        return 0;
                }
            };

            switch (event.key) {
                case 'Escape':
                    return doCancel();
                case 'Enter':
                case 'Tab':
                    event.preventDefault();
                    event.stopPropagation();
                    return doCompleteOrCancel();
            }

            const delta = computeDelta();

            if (delta !== 0 && ! cursorWithinActionInput(action, actionInput, delta)) {
                doCompleteOrCancel();

                switch (event.key) {
                    case 'ArrowLeft':
                    case 'Backspace':
                        event.stopPropagation();
                        event.preventDefault();
                        break;
                }

            }
        };

        const handleClick = () => doCompleteOrCancel();

        const handleInput = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();

            const text = actionInput.computeActionInputText();

            onActionInputChange(text);
        };

        elem.addEventListener('keydown', handleKeyDown);
        elem.addEventListener('click', handleClick);
        elem.addEventListener('input', handleInput);

        return {
            position,
            undoContent: initialMarkdown,
            getActionRangeForHandler: () => createActionRangeForHandler(actionInput),
            reset: doCancel,
        };
    }
}

export const useBlockActionTrigger = () => {
    const actionStore = useActionMenuStore();
    const actionExecutor = useActionExecutor();
    const blocksStore = useBlocksStore();

    return React.useCallback((id: BlockIDStr, elem: HTMLElement, action: IAction) => {
        const getActionsProvider = () => {
            const namedBlocks = blocksStore.namedBlockEntries.map(({ label }) => ({
                id: label,
                text: label,
            }));

            return createActionsProvider(namedBlocks);
        };

        const actionsProvider = getActionsProvider();

        const computeItems = (prompt: string) => {
            return [...(prompt.length === 0 ? [] : actionsProvider(prompt))]
                   .sort((a, b) => a.text.localeCompare(b.text))
        };

        const onCancel = () => {
            actionStore.setState(undefined);
        };

        const onComplete = (text: string) => actionHandler(text);

        const onActionInputChange = (text: string) => {
            const items = computeItems(text);
            actionStore.updateState(items);
        };

        const result = BlockActionUtils.triggerAction({
            action,
            elem,
            onCancel,
            onComplete,
            onActionInputChange,
        });

        if (! result) {
            return;
        }


        const {
            getActionRangeForHandler,
            position,
            undoContent,
            reset
        } = result;

        const actionHandler = (target: BlockIDStr) => {

            const actionType = { type: action.type, target };

            const {from, to} = getActionRangeForHandler();


            const actionOp = {
                ...actionType,
                undoContent
            };

            actionExecutor(id, from, to, actionOp);

            reset();

        };

        actionStore.setState({
            position: position,
            items: [],
            onAction: actionHandler,
        });

        actionStore.setReset(() => reset());
    }, [blocksStore, actionExecutor, actionStore]);
};

interface IUseBlockActionOpts {

    readonly id: BlockIDStr;

    readonly ref: React.RefObject<HTMLElement>;
}

export const useBlockAction = (opts: IUseBlockActionOpts) => {

    const { id, ref } = opts;
    const triggerAction = useBlockActionTrigger();

    React.useEffect(() => {
        const elem = ref.current;

        if (! elem) {
            return;
        };

        const handleInput = (e: Event) => {

            const event = e as InputEvent;

            const split = ContentEditables.splitAtCursor(elem)

            if (! split) {
                return;
            }

            const prefixText = ContentEditables.fragmentToText(split.prefix);

            const findTriggeredAction = () => {

                for (let action of ACTIONS) {
                    if (action.trigger.length === 1 && event.data === action.trigger) {
                        return action;
                    }

                    if (prefixText.endsWith(action.trigger) && event.data === action.trigger.slice(-1)) {
                        return action;
                    }
                }

                return undefined;
            };

            const triggeredAction = findTriggeredAction();

            if (triggeredAction) {
                triggerAction(id, elem, triggeredAction);
            }
        };

        elem.addEventListener('input', handleInput);

        return () => elem.removeEventListener('input', handleInput);
    }, [ref, triggerAction, id]);

};

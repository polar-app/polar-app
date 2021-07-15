import {Platform, Platforms} from "polar-shared/src/util/Platforms";
import React from "react";
import {BlocksTreeStore} from "../BlocksTreeStore";
import {useBlocksTreeStore} from "../BlocksTree";
import {ContentEditables} from "../ContentEditables";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {CursorPositions} from "./CursorPositions";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

const PAGE_NAV_BLOCKS_JUMP_COUNT = 10; 

const hasEditorSelection = (): boolean => {

    const selection = window.getSelection();

    if (selection) {
        const range = selection.getRangeAt(0);
        return range.cloneContents().textContent !== '';
    } else {
        return false;
    }

};

const abortEvent = (event: React.KeyboardEvent): void => {
    event.stopPropagation();
    event.preventDefault();
};

export const navNBlocks = (blocksTreeStore: BlocksTreeStore, delta: 'prev' | 'next', shiftKey: boolean) => {
    const nav = () => blocksTreeStore[delta === 'prev' ? 'navPrev' : 'navNext']('start', { shiftKey: shiftKey });

    for (
        let i = 0;
        i < PAGE_NAV_BLOCKS_JUMP_COUNT && nav();
        i += 1
    );
};

export const hasModifiers = (event: React.KeyboardEvent, includeShift: boolean = true): boolean =>
    event.ctrlKey || event.metaKey || event.altKey || (includeShift && event.shiftKey);

type KeydownHandlerOpts = {
    event: React.KeyboardEvent;
    contentEditableElem: HTMLElement;
    platform: Platform;
    blocksTreeStore: BlocksTreeStore;
    blockID: BlockIDStr;
    readonly: boolean;
};
type KeydownHandler = (opts: KeydownHandlerOpts) => void;

const HANDLERS: Record<string, KeydownHandler | undefined> = {
    ArrowUp: ({ contentEditableElem, blocksTreeStore, event, blockID }) => {
        if (event.ctrlKey || event.metaKey) {
            blocksTreeStore.collapse(blockID);
            abortEvent(event);
            return;
        }

        if (event.altKey && event.shiftKey) {
            const selectedIDs = blocksTreeStore.hasSelected() ? blocksTreeStore.selectedIDs() : [blockID];
            blocksTreeStore.moveBlocks(selectedIDs, -1);
            abortEvent(event);
            return;
        }

        if (event.shiftKey && ! ContentEditables.selectionAtStart(contentEditableElem)) {
            if (! blocksTreeStore.hasSelected()) {
                // don't handle shift until we allow the range to be selected.
                return;
            }
        }

        abortEvent(event);
        const pos = CursorPositions.computeCurrentOffset(contentEditableElem);
        blocksTreeStore.navPrev(pos || 'start', { shiftKey: event.shiftKey });
    },
    ArrowDown: ({ event, blockID, contentEditableElem, blocksTreeStore }) => {
        if (event.ctrlKey || event.metaKey) {
            blocksTreeStore.expand(blockID);
            abortEvent(event);
            return;
        }

        if (event.altKey && event.shiftKey) {
            const selectedIDs = blocksTreeStore.hasSelected() ? blocksTreeStore.selectedIDs() : [blockID];
            blocksTreeStore.moveBlocks(selectedIDs, 1);
            abortEvent(event);
            return;
        }

        if (event.shiftKey && ! ContentEditables.selectionAtEnd(contentEditableElem)) {
            if (! blocksTreeStore.hasSelected()) {
                // don't handle shift until we allow the range to be selected.
                return;
            }
        }

        abortEvent(event);
        const pos = CursorPositions.computeCurrentOffset(contentEditableElem);
        blocksTreeStore.navNext(pos || 'start', { shiftKey: event.shiftKey });
    },
    ArrowLeft: ({ event, platform, blockID, contentEditableElem, blocksTreeStore }) => {

        if (! hasEditorSelection()) {

            const isMacOS = platform === Platform.MACOS;
            const isPC = [Platform.LINUX, Platform.WINDOWS].indexOf(platform) > -1;
            if ((isMacOS && event.shiftKey && event.metaKey) ||
                (isPC && event.shiftKey && event.altKey)) {

                blocksTreeStore.unIndentBlock(blockID);
                return;

            }

        }

        if (! hasModifiers(event)) {

            if (ContentEditables.cursorAtStart(contentEditableElem)) {
                abortEvent(event);
                blocksTreeStore.navPrev('end', { shiftKey: event.shiftKey });
            }

        }
    },
    ArrowRight: ({ event, platform, blockID, contentEditableElem, blocksTreeStore }) => {

        if (! hasEditorSelection()) {

            const isMacOS = platform === Platform.MACOS;
            const isPC = [Platform.LINUX, Platform.WINDOWS].indexOf(platform) > -1;
            if ((isMacOS && event.shiftKey && event.metaKey) ||
                (isPC && event.shiftKey && event.altKey)) {
                blocksTreeStore.indentBlock(blockID);
                return;
            }

        }

        if (! hasModifiers(event)) {

            if (ContentEditables.cursorAtEnd(contentEditableElem)) {
                abortEvent(event);
                blocksTreeStore.navNext('start', { shiftKey: event.shiftKey });
            }

        }

    },
    Tab: ({ event, blockID, blocksTreeStore }) => {

        const {parent} = blocksTreeStore.getBlock(blockID)!;
        if (parent !== undefined) {

            abortEvent(event);

            if (event.shiftKey) {
                blocksTreeStore.unIndentBlock(blockID);
            } else {
                blocksTreeStore.indentBlock(blockID);
            }

        }
    },
    Enter: ({ event, blockID, blocksTreeStore, contentEditableElem }) => {
        abortEvent(event);
        if (blocksTreeStore.hasSelected()) {
            blocksTreeStore.clearSelected("keydownHandler: Enter");
            return;
        }
        if (blocksTreeStore.requiredAutoUnIndent(blockID)) {
            blocksTreeStore.unIndentBlock(blockID);
        } else {
            const split = ContentEditables.splitAtCursor(contentEditableElem);

            if (split) {

                const prefix = MarkdownContentConverter.toMarkdown(ContentEditables.fragmentToHTML(split.prefix));
                const suffix = MarkdownContentConverter.toMarkdown(ContentEditables.fragmentToHTML(split.suffix));

                blocksTreeStore.createNewBlock(blockID, {split: {prefix, suffix}});

            }
        }
    },
    Backspace: ({ event, blockID, contentEditableElem, readonly, blocksTreeStore }) => {
        if (readonly) {
            return abortEvent(event);
        }

        if (hasEditorSelection()) {
            console.log("Not handling Backspace");
            return;
        }

        // TODO: only do this if there aren't any modifiers I think...
        // don't do a manual delete and just always merge.
        // if (props.parent !== undefined && store.noteIsEmpty(props.id)) {
        //     abortEvent();
        //     store.doDelete([props.id]);
        //     break;
        // }

        if (blocksTreeStore.hasSelected()) {
            abortEvent(event);

            const selected = blocksTreeStore.selectedIDs();

            if (selected.length > 0) {
                blocksTreeStore.deleteBlocks(selected);
            }
            return;
        }

        if (ContentEditables.cursorAtStart(contentEditableElem)) {
            const mergeTarget = blocksTreeStore.canMergePrev(blockID);

            if (mergeTarget) {
                abortEvent(event);
                blocksTreeStore.mergeBlocks(mergeTarget.target, mergeTarget.source);
            }
        }
    },
    Delete: ({ event, blockID, contentEditableElem, readonly, blocksTreeStore }) => {
        if (readonly) {
            return abortEvent(event);
        }

        if (hasEditorSelection()) {
            console.log("Not handling Delete");
            return;
        }

        if (blocksTreeStore.hasSelected()) {
            abortEvent(event);

            const selected = blocksTreeStore.selectedIDs();

            if (selected.length > 0) {
                blocksTreeStore.deleteBlocks(selected);
            }
            return;
        }

        if (ContentEditables.cursorAtEnd(contentEditableElem)) {
            const mergeTarget = blocksTreeStore.canMergeNext(blockID);

            if (mergeTarget) {
                abortEvent(event);
                blocksTreeStore.mergeBlocks(mergeTarget.target, mergeTarget.source);
            }
        }
    },
    PageUp: ({ blocksTreeStore, event }) => {
        abortEvent(event);
        navNBlocks(blocksTreeStore, 'prev', event.shiftKey);
    },
    PageDown: ({ blocksTreeStore, event }) => {
        abortEvent(event);
        navNBlocks(blocksTreeStore, 'next', event.shiftKey);
    },
};


type IUseBlockKeyDownHandlerOpts = {
    contentEditableRef: React.RefObject<HTMLDivElement | null>,
    blockID: BlockIDStr;
    onKeyDown?: React.EventHandler<React.KeyboardEvent>;
    readonly?: boolean;
};

type IUseBlockKeyDownHandlerBinds = {
    onKeyDown: React.EventHandler<React.KeyboardEvent>;
};

export const useBlockKeyDownHandler = (opts: IUseBlockKeyDownHandlerOpts): IUseBlockKeyDownHandlerBinds => {
    const { contentEditableRef, blockID, onKeyDown, readonly = false } = opts;
    const blocksTreeStore = useBlocksTreeStore();
    const platform = React.useMemo(() => Platforms.get(), []);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        const elem = contentEditableRef.current;
        if (! elem) {
            return;
        }

        const handler = HANDLERS[event.key];
        if (handler) {
            handler({
                contentEditableElem: elem,
                platform,
                event,
                blocksTreeStore,
                blockID,
                readonly
            });
        } else if (readonly && !hasModifiers(event, false)) {
            abortEvent(event);
        }
        if (blocksTreeStore.hasSelected() && !hasModifiers(event, false)) {
            abortEvent(event);
        }

        if (onKeyDown) {
            onKeyDown(event);
        }

    }, [onKeyDown, blockID, platform, blocksTreeStore, contentEditableRef, readonly]);

    React.useEffect(() => {
        const elem = contentEditableRef.current;
        if (! readonly || ! elem) {
            return;
        }
        const abort = (e: Event) => e.preventDefault();
        elem.addEventListener('cut', abort);
        elem.addEventListener('paste', abort);
        return () => {
            elem.removeEventListener('cut', abort);
            elem.removeEventListener('paste', abort);
        };
    }, [readonly, contentEditableRef]);

    return { onKeyDown: handleKeyDown };
};

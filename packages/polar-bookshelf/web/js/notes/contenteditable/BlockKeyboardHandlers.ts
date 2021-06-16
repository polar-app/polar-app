import {Platform, Platforms} from "polar-shared/src/util/Platforms";
import React from "react";
import {ContentEditables} from "../ContentEditables";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {BlockIDStr, useBlocksStore} from "../store/BlocksStore";
import {IBlocksStore} from "../store/IBlocksStore";


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

export const hasModifiers = (event: React.KeyboardEvent, includeShift: boolean = true): boolean =>
    event.ctrlKey || event.metaKey || event.altKey || (includeShift && event.shiftKey);

type KeydownHandlerOpts = {
    event: React.KeyboardEvent;
    contentEditableElem: HTMLElement;
    platform: Platform;
    blocksStore: IBlocksStore; 
    blockID: string;
    readonly: boolean;
};
type KeydownHandler = (opts: KeydownHandlerOpts) => void;

const HANDLERS: Record<string, KeydownHandler | undefined> = {
    ArrowUp: ({ contentEditableElem, event, blocksStore, blockID }) => {
        if (event.ctrlKey || event.metaKey) {
            blocksStore.collapse(blockID);
            abortEvent(event);
            return;
        }

        if (event.altKey && event.shiftKey) {
            const selectedIDs = blocksStore.hasSelected() ? blocksStore.selectedIDs() : [blockID];
            blocksStore.moveBlocks(selectedIDs, -1);
            abortEvent(event);
            return;
        }

        if (event.shiftKey && ! ContentEditables.selectionAtStart(contentEditableElem)) {
            if (! blocksStore.hasSelected()) {
                // don't handle shift until we allow the range to be selected.
                return;
            }
        }

        abortEvent(event);
        blocksStore.navPrev('start', { shiftKey: event.shiftKey });
    },
    ArrowDown: ({ event, blocksStore, blockID, contentEditableElem }) => {
        if (event.ctrlKey || event.metaKey) {
            blocksStore.expand(blockID);
            abortEvent(event);
            return;
        }

        if (event.altKey && event.shiftKey) {
            const selectedIDs = blocksStore.hasSelected() ? blocksStore.selectedIDs() : [blockID];
            blocksStore.moveBlocks(selectedIDs, 1);
            abortEvent(event);
            return;
        }

        if (event.shiftKey && ! ContentEditables.selectionAtEnd(contentEditableElem)) {
            if (! blocksStore.hasSelected()) {
                // don't handle shift until we allow the range to be selected.
                return;
            }
        }

        abortEvent(event);
        blocksStore.navNext('start', { shiftKey: event.shiftKey });
    },
    ArrowLeft: ({ event, platform, blockID, blocksStore, contentEditableElem }) => {

        if (! hasEditorSelection()) {

            const isMacOS = platform === Platform.MACOS;
            const isPC = [Platform.LINUX, Platform.WINDOWS].indexOf(platform) > -1;
            if ((isMacOS && event.shiftKey && event.metaKey) ||
                (isPC && event.shiftKey && event.altKey)) {

                blocksStore.unIndentBlock(blockID);
                return;

            }

        }

        if (! hasModifiers(event)) {

            if (ContentEditables.cursorAtStart(contentEditableElem)) {
                abortEvent(event);
                blocksStore.navPrev('end', { shiftKey: event.shiftKey });
            }

        }
    },
    ArrowRight: ({ event, platform, blocksStore, blockID, contentEditableElem }) => {

        if (! hasEditorSelection()) {

            const isMacOS = platform === Platform.MACOS;
            const isPC = [Platform.LINUX, Platform.WINDOWS].indexOf(platform) > -1;
            if ((isMacOS && event.shiftKey && event.metaKey) ||
                (isPC && event.shiftKey && event.altKey)) {
                blocksStore.indentBlock(blockID);
                return;
            }

        }

        if (! hasModifiers(event)) {

            if (ContentEditables.cursorAtEnd(contentEditableElem)) {
                abortEvent(event);
                blocksStore.navNext('start', { shiftKey: event.shiftKey });
            }

        }

    },
    Tab: ({ event, blockID, blocksStore }) => {

        const {parent} = blocksStore.getBlock(blockID)!;
        if (parent !== undefined) {

            abortEvent(event);

            if (event.shiftKey) {
                blocksStore.unIndentBlock(blockID);
            } else {
                blocksStore.indentBlock(blockID);
            }

        }
    },
    Enter: ({ event, blockID, blocksStore, contentEditableElem }) => {
        abortEvent(event);
        if (blocksStore.hasSelected()) {
            blocksStore.clearSelected("keydownHandler: Enter");
            return;
        }
        if (blocksStore.requiredAutoUnIndent(blockID)) {
            blocksStore.unIndentBlock(blockID);
        } else {
            const split = ContentEditables.splitAtCursor(contentEditableElem);

            if (split) {

                const prefix = MarkdownContentConverter.toMarkdown(ContentEditables.fragmentToHTML(split.prefix));
                const suffix = MarkdownContentConverter.toMarkdown(ContentEditables.fragmentToHTML(split.suffix));

                blocksStore.createNewBlock(blockID, {split: {prefix, suffix}});

            }
        }
    },
    Backspace: ({ event, blocksStore, blockID, contentEditableElem, readonly }) => {
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

        if (blocksStore.hasSelected()) {
            abortEvent(event);

            const selected = blocksStore.selectedIDs();

            if (selected.length > 0) {
                blocksStore.deleteBlocks(selected);
            }
            return;
        }

        if (ContentEditables.cursorAtStart(contentEditableElem)) {
            const mergeTarget = blocksStore.canMergePrev(blockID);

            if (mergeTarget) {
                abortEvent(event);
                blocksStore.mergeBlocks(mergeTarget.target, mergeTarget.source);
            }
        }
    },
    Delete: ({ event, blocksStore, blockID, contentEditableElem, readonly }) => {
        if (readonly) {
            return abortEvent(event);
        }

        if (hasEditorSelection()) {
            console.log("Not handling Delete");
            return;
        }

        if (blocksStore.hasSelected()) {
            abortEvent(event);

            const selected = blocksStore.selectedIDs();

            if (selected.length > 0) {
                blocksStore.deleteBlocks(selected);
            }
            return;
        }

        if (ContentEditables.cursorAtEnd(contentEditableElem)) {
            const mergeTarget = blocksStore.canMergeNext(blockID);

            if (mergeTarget) {
                abortEvent(event);
                blocksStore.mergeBlocks(mergeTarget.target, mergeTarget.source);
            }
        }
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
    const blocksStore = useBlocksStore();
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
                blocksStore,
                blockID, 
                readonly
            });
        } else if (readonly && !hasModifiers(event, false)) {
            abortEvent(event);
        }
        if (blocksStore.hasSelected() && !hasModifiers(event, false)) {
            abortEvent(event);
        }

        if (onKeyDown) {
            onKeyDown(event);
        }

    }, [onKeyDown, blockID, platform, blocksStore, contentEditableRef, readonly]);

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

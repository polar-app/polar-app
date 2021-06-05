import {Platform, Platforms} from "polar-shared/src/util/Platforms";
import React from "react";
import {useHistory} from "react-router";
import {ContentEditables} from "../ContentEditables";
import {BlockIDStr, NavOpts, useBlocksStore} from "../store/BlocksStore";


const hasEditorSelection = (): boolean => {

    const selection = window.getSelection();

    if (selection) {
        const range = selection.getRangeAt(0);
        return range.cloneContents().textContent !== '';
    } else {
        return false;
    }

};


type IUseBlockKeyDownHandlerOpts = {
    contentEditableRef: React.RefObject<HTMLDivElement>,
    blockID: BlockIDStr;
    parent?: BlockIDStr;
    onKeyDown?: React.EventHandler<React.KeyboardEvent>;
    allowEdits?: boolean;
};

type IUseBlockKeyDownHandlerBinds = {
    onKeyDown: React.EventHandler<React.KeyboardEvent>;
};

export const useBlockKeyDownHandler = (opts: IUseBlockKeyDownHandlerOpts): IUseBlockKeyDownHandlerBinds => {
    const { contentEditableRef, blockID, parent, onKeyDown, allowEdits = true } = opts;
    const blocksStore = useBlocksStore();
    const platform = React.useMemo(() => Platforms.get(), []);
    const history = useHistory();

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        const elem = contentEditableRef.current;
        if (! elem) {
            return;
        }

        const cursorAtStart = ContentEditables.cursorAtStart(elem);
        const cursorAtEnd = ContentEditables.cursorAtEnd(elem);

        function abortEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        const opts: NavOpts = {
            shiftKey: event.shiftKey
        }

        const hasModifiers = event.ctrlKey || event.shiftKey || event.metaKey || event.altKey;

        switch (event.key) {

            case 'ArrowUp':

                if (event.ctrlKey || event.metaKey) {
                    blocksStore.collapse(blockID)
                    abortEvent();
                    break;
                }

                if (event.shiftKey && ! ContentEditables.selectionAtStart(elem)) {
                    if (! blocksStore.hasSelected()) {
                        // don't handle shift until we allow the range to be selected.
                        break;
                    }
                }

                abortEvent();
                blocksStore.navPrev('start', opts);
                break;

            case 'ArrowDown':

                if (event.ctrlKey || event.metaKey) {
                    blocksStore.expand(blockID);
                    abortEvent();
                    break;
                }

                if (event.shiftKey && ! ContentEditables.selectionAtEnd(elem)) {
                    if (! blocksStore.hasSelected()) {
                        // don't handle shift until we allow the range to be selected.
                        break;
                    }
                }

                abortEvent();
                blocksStore.navNext('start', opts);

                break;

            case 'ArrowLeft':

                if (event.metaKey) {
                    console.log("History back");
                    // FIXME: this doesn't seem to work...
                    history.go(-1);
                    abortEvent();
                    break;
                }

                if (! hasEditorSelection()) {

                    if ((platform === Platform.MACOS && event.shiftKey && event.metaKey) ||
                        (platform === Platform.WINDOWS && event.shiftKey && event.altKey)) {

                        blocksStore.unIndentBlock(blockID);
                        break;

                    }

                }

                if (! hasModifiers) {

                    if (cursorAtStart) {
                        abortEvent();
                        blocksStore.navPrev('end', opts);
                    }

                }

                break;

            case 'ArrowRight':

                if (event.metaKey) {
                    console.log("History forward");
                    history.goForward();
                    abortEvent();
                    break;
                }

                if (! hasEditorSelection()) {

                    if ((platform === Platform.MACOS && event.shiftKey && event.metaKey) ||
                        (platform === Platform.WINDOWS && event.shiftKey && event.altKey)) {
                        blocksStore.indentBlock(blockID);
                        break;
                    }

                }

                if (! hasModifiers) {

                    if (cursorAtEnd) {
                        abortEvent();
                        blocksStore.navNext('start', opts);
                    }

                }

                break;

            case 'Backspace':
            case 'Delete':
                if (!allowEdits) {
                    abortEvent();
                    break;
                }

                if (hasEditorSelection()) {
                    console.log("Not handling Backspace");
                    break;
                }

                // TODO: only do this if there aren't any modifiers I think...
                // don't do a manual delete and just always merge.
                // if (props.parent !== undefined && store.noteIsEmpty(props.id)) {
                //     abortEvent();
                //     store.doDelete([props.id]);
                //     break;
                // }

                if (blocksStore.hasSelected()) {
                    abortEvent();

                    const selected = blocksStore.selectedIDs();

                    if (selected.length > 0) {
                        blocksStore.deleteBlocks(selected);
                    }
                    break;
                }

                const isBackspace = event.key === 'Backspace';
                if (isBackspace ? cursorAtStart : cursorAtEnd) {

                    // we're at the beginning of a note...

                    const mergeTarget = blocksStore[isBackspace ? 'canMergePrev' : 'canMergeNext'](blockID);

                    if (mergeTarget) {
                        abortEvent();
                        blocksStore.mergeBlocks(mergeTarget.target, mergeTarget.source);
                        break;
                    }

                }
                break;
            case 'Tab':

                if (parent !== undefined) {

                    abortEvent();

                    if (event.shiftKey) {
                        blocksStore.unIndentBlock(blockID);
                    } else {
                        blocksStore.indentBlock(blockID);
                    }

                }

                break;

            default:
                if (!allowEdits) {
                    abortEvent();
                }
                break;

        }

        if (onKeyDown) {
            onKeyDown(event);
        }

    }, [onKeyDown, parent, blockID, history, platform, blocksStore, contentEditableRef]);

    return { onKeyDown: handleKeyDown };
};

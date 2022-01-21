import React from "react";
import {Box, IconButton, TextField} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import {useBlockContentUpdater} from "../BlockEditor";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {BlockContentCanonicalizer} from "../contenteditable/BlockContentCanonicalizer";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {ContentEditables} from "../ContentEditables";
import {useBlockFormatBarStore} from "./NoteFormatBar";
import {useBlockTagEditorDialog, useCreateBacklinkFromSelection} from "../NoteUtils";
import {useBlocksStore} from "../store/BlocksStore";
import {INoteFormatBarAction} from "./NoteFormatBarStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {useUndoQueue} from "../../undo/UndoQueueProvider2";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";

type IContentEditableTextStyle = 'bold'
                                 | 'italic'
                                 | 'subscript'
                                 | 'superscript'
                                 | 'underline'
                                 | 'strikeThrough'
                                 | 'removeFormat'
                                 | 'createLink';

const withFocusedBlock = (cb: (id: BlockIDStr, root: BlockIDStr) => void) => {
    const elem = DOMBlocks.getFocusedBlock();
    const treeElem = elem ? DOMBlocks.findParentTree(elem) : null;

    if (! elem || ! treeElem) {
        return;
    }

    const id = DOMBlocks.getBlockID(elem);
    const root = DOMBlocks.getTreeRoot(treeElem);

    if (! id || ! root) {
        return;
    }

    cb(id, root);
};

const useExecCommandExecutor = (command: IContentEditableTextStyle) => {
    const blockContentUpdater = useBlockContentUpdater();

    return React.useCallback((value?: string) => {
        const range = ContentEditables.currentRange();

        if (! range) {
            return;
        }

        const elem = DOMBlocks.findBlockParent(range.startContainer);
        const id = elem ? DOMBlocks.getBlockID(elem) : undefined;

        if (! elem || ! id) {
            return;
        }

        document.execCommand(command, false, value);

        if (range.collapsed) {
            return;
        }

        // Update block
        const div = BlockContentCanonicalizer.canonicalizeElement(elem);
        const newContent = MarkdownContentConverter.toMarkdown(div.innerHTML);

        blockContentUpdater(id, newContent);
    }, [command, blockContentUpdater]);
};

export const useLinkDialog = () => {
    const dialogManager = useDialogManager();
    const blockFormatBarStore = useBlockFormatBarStore();
    const { handleCreateLink } = useNoteFormatBarActions();

    return React.useCallback(() => {
        dialogManager.prompt({
            title: 'Add external URL',
            placeholder: 'Paste URL',
            onDone: handleCreateLink,
            onCancel: () => blockFormatBarStore.clearAction(),
        });
    }, [dialogManager, handleCreateLink, blockFormatBarStore]);
}

interface ILinkCreatorProps {
    readonly onLink: (link: string) => void;
    readonly onClose: () => void;
}

export const LinkCreator: React.FC<ILinkCreatorProps> = (props) => {
    const { onLink, onClose } = props;
    const valueRef = React.useRef("");

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        valueRef.current = event.currentTarget.value;
    }, []);

    const handleCreateLink = React.useCallback(() => {
        const value = valueRef.current;
        if (! value.startsWith('http:') && ! value.startsWith('https:')) {
            return;
        }

        onLink(value);
    }, [onLink, valueRef]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {
        switch (event.key) {
            case 'Enter':
                handleCreateLink();
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [handleCreateLink, onClose]);


    return (
        <Box display="flex" alignItems="center">
            <TextField required
                       placeholder="https://example.com"
                       autoFocus
                       style={{ flex: 1 }}
                       onKeyUp={handleKeyUp}
                       onChange={handleChange}/>

            <IconButton onClick={handleCreateLink} style={{ padding: 6 }}>
                <CheckIcon fontSize="small" style={{ color: 'green' }} />
            </IconButton>

        </Box>
    );
};

export const useNoteFormatBarActions = () => {
    const blocksStore = useBlocksStore();
    const blockFormatBarStore = useBlockFormatBarStore();
    const tagEditorDialog = useBlockTagEditorDialog();
    const undoQueue = useUndoQueue();

    const handleBold = useExecCommandExecutor('bold');
    const handleItalic = useExecCommandExecutor('italic');
    const handleStrikeThrough = useExecCommandExecutor('strikeThrough');
    const handleSuperscript = useExecCommandExecutor('superscript');
    const handleSubscript = useExecCommandExecutor('subscript');
    const handleRemoveFormat = useExecCommandExecutor('removeFormat');
    const handleUnderline = useExecCommandExecutor('underline');
    const handleLink = useExecCommandExecutor('createLink');
    const createBacklinkinkFromSelection = useCreateBacklinkFromSelection();

    const handleBacklink = React.useCallback(() => {
        const id = blocksStore.active?.id;

        if (id) {
            createBacklinkinkFromSelection(id);
        }
    }, [blocksStore, createBacklinkinkFromSelection]);

    const handleActionChange = React.useCallback((action: INoteFormatBarAction) => {
        return () => {
            blockFormatBarStore.toggleAction(action);
            blockFormatBarStore.saveRange();
        };
    }, [blockFormatBarStore]);

    const handleCreateLink = React.useCallback((link: string) => {
        blockFormatBarStore.restoreRange();
        handleLink(link);

        const range = ContentEditables.currentRange();
        if (range) {
            range.collapse();
        }
    }, [blockFormatBarStore, handleLink]);

    const handleIndent = React.useCallback(() =>
        withFocusedBlock((id, root) => blocksStore.indentBlock(root, id)), [blocksStore]);

    const handleUnindent = React.useCallback(() =>
        withFocusedBlock((id, root) => blocksStore.unIndentBlock(root, id)), [blocksStore]);

    const handleEditTags = React.useCallback(() =>
        withFocusedBlock(id => tagEditorDialog([id])), [tagEditorDialog]);

    const handleUndo = React.useCallback(() => undoQueue.undo(), [undoQueue]);
    const handleRedo = React.useCallback(() => undoQueue.redo(), [undoQueue]);

    return React.useMemo(() => ({
        handleBold,
        handleItalic,
        handleStrikeThrough,
        handleSuperscript,
        handleSubscript,
        handleRemoveFormat,
        handleUnderline,
        handleLink,
        handleBacklink,
        handleActionChange,
        handleCreateLink,
        handleIndent,
        handleUnindent,
        handleEditTags,
        handleUndo,
        handleRedo,
    }), [
        handleBold,
        handleItalic,
        handleStrikeThrough,
        handleSuperscript,
        handleSubscript,
        handleRemoveFormat,
        handleUnderline,
        handleLink,
        handleBacklink,
        handleActionChange,
        handleCreateLink,
        handleIndent,
        handleUnindent,
        handleEditTags,
        handleUndo,
        handleRedo,
    ]);
};

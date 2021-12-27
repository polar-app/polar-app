import React from "react";
import {createStyles, lighten, makeStyles} from "@material-ui/core";
import {NoteFormatBarPopperHandheldBar} from "./NoteFormatBarPopperHandheldBar";
import {NoteFormatBarPopperHandheldExtension} from "./NoteFormatBarPopperHandheldExtension";
import clsx from "clsx";
import {useBlockTagEditorDialog, useCreateBacklinkFromSelection} from "../../NoteUtils";
import {useUndoQueue} from "../../../undo/UndoQueueProvider2";
import {useBlocksStore} from "../../store/BlocksStore";
import {useExecCommandExecutor} from "../NoteFormatBarActions";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "../../contenteditable/DOMBlocks";

const NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT = 200;
const NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT = 42;

export const useNoteFormatBarPopperHandheldStyles = makeStyles((theme) =>
    createStyles({
        paperRoot: {
            borderRadius: 0,
            borderTop: `1px solid ${lighten(theme.palette.background.paper, 0.15)}`,
        },
        container: {
            width: '100%',
            overflow: 'hidden',
            height: NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT,
            willChange: 'height',
            transition: 'height 190ms ease-in-out',
            '&.open': {
                height: NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT
                        + NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT,
            },
        },
        bar: {
            height: theme.spacing(5.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        extension: {
            height: NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT,
            overflowY: 'auto',
        },
    })
);

export const NoteFormatBarPopperHandheld: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useNoteFormatBarPopperHandheldStyles();

    const handleToggleExpand = React.useCallback(() =>
        setExpanded(expanded => ! expanded), []);

    const abortEvent = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const createBacklinkinkFromSelection = useCreateBacklinkFromSelection();
    const undoQueue = useUndoQueue();
    const blocksStore = useBlocksStore();

    const handleBold = useExecCommandExecutor('bold');
    const handleItalic = useExecCommandExecutor('italic');
    const handleStrikeThrough = useExecCommandExecutor('strikeThrough');
    const handleUndo = React.useCallback(() => undoQueue.undo(), [undoQueue]);
    const handleRedo = React.useCallback(() => undoQueue.redo(), [undoQueue]);
    const handleBacklink = React.useCallback(() => {
        const id = blocksStore.active?.id;

        if (id) {
            createBacklinkinkFromSelection(id);
        }
    }, [blocksStore, createBacklinkinkFromSelection]);

    const handleHideKeyboard = React.useCallback(() => {
        const selection = document.getSelection();

        if (selection) {
            selection.removeAllRanges();
        }
    }, []);

    const tagEditorDialog = useBlockTagEditorDialog();

    const withBlockID = React.useCallback((cb: (id: BlockIDStr, root: BlockIDStr) => void) => {
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
    }, []);

    const handleIndent = React.useCallback(() =>
        withBlockID((id, root) => blocksStore.indentBlock(root, id)), [withBlockID, blocksStore]);

    const handleUnindent = React.useCallback(() =>
        withBlockID((id, root) => blocksStore.unIndentBlock(root, id)), [withBlockID, blocksStore]);

    const handleEditTags = React.useCallback(() =>
        withBlockID(id => tagEditorDialog([id])), [tagEditorDialog, withBlockID]);

    return (
        <div className={clsx(classes.container, { open: expanded })} onMouseDown={abortEvent}>
            <NoteFormatBarPopperHandheldBar onToggleExpand={handleToggleExpand}
                                            className={classes.bar}
                                            expanded={expanded}
                                            onIndent={handleIndent}
                                            onUnindent={handleUnindent}
                                            onBold={handleBold}
                                            onItalic={handleItalic}
                                            onBacklink={handleBacklink}
                                            onHideKeyboard={handleHideKeyboard}
                                            onStrikeThrough={handleStrikeThrough} />

            <NoteFormatBarPopperHandheldExtension className={classes.extension}
                                                  onRedo={handleRedo}
                                                  onUndo={handleUndo}
                                                  onEditTags={handleEditTags}
                                                  />
        </div>
    );
};

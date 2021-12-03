import React from "react";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import clsx from "clsx";
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {useNoteFormatBarPopperHandheldStyles} from "./NoteFormatBarPopperHandheld";
import {NoteFormatBarExtensionButton} from "../NoteFormatBarButton";
import {useBlockTagEditorDialog} from "../../NoteUtils";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "../../contenteditable/DOMBlocks";
import {useBlocksStore} from "../../store/BlocksStore";

interface INoteFormatBarPopperExtensionHandheldProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${theme.spacing(9)}px, 1fr))`,
            gridRowGap: theme.spacing(5),
            gridColumnGap: theme.spacing(1.5),
        },
        icon: { fontSize: '1.3rem' },
    })
);

export const NoteFormatBarPopperHandheldExtension: React.FC<INoteFormatBarPopperExtensionHandheldProps> = (props) => {
    const { className, style } = props;
    const sharedClasses = useNoteFormatBarPopperHandheldStyles();
    const classes = useStyles();
    const tagEditorDialog = useBlockTagEditorDialog();
    const blocksStore = useBlocksStore();

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
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box py={3.75} px={2} className={classes.root}>
                <NoteFormatBarExtensionButton icon={<FormatIndentDecreaseIcon className={classes.icon} />}
                                              onClick={handleUnindent}>
                    Indent left
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<FormatIndentIncreaseIcon className={classes.icon} />}
                                              onClick={handleIndent}>
                    Indent right
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<LocalOfferIcon className={classes.icon} />}
                                              onClick={handleEditTags}>
                    Add tags
                </NoteFormatBarExtensionButton>
            </Box>
        </Paper>
    );
};


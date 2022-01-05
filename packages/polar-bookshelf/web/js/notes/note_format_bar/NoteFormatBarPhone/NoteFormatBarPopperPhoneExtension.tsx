import React from "react";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import clsx from "clsx";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {useNoteFormatBarPopperPhoneStyles} from "./NoteFormatBarPopperPhone";
import {NoteFormatBarExtensionButton} from "../NoteFormatBarButton";

interface INoteFormatBarPopperExtensionPhoneProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly onUndo: () => void;
    readonly onRedo: () => void;
    readonly onEditTags: () => void;
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

export const NoteFormatBarPopperPhoneExtension: React.FC<INoteFormatBarPopperExtensionPhoneProps> = (props) => {
    const { className, style, onUndo, onRedo, onEditTags } = props;
    const sharedClasses = useNoteFormatBarPopperPhoneStyles();
    const classes = useStyles();

    return (
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box py={3.75} px={2} className={classes.root}>
                <NoteFormatBarExtensionButton icon={<UndoIcon className={classes.icon} />}
                                              onClick={onUndo}>
                    Indent left
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<RedoIcon className={classes.icon} />}
                                              onClick={onRedo}>
                    Indent right
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<LocalOfferIcon className={classes.icon} />}
                                              onClick={onEditTags}>
                    Add tags
                </NoteFormatBarExtensionButton>
            </Box>
        </Paper>
    );
};


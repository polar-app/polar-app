import React from "react";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import clsx from "clsx";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {useNoteFormatBarPopperHandheldStyles} from "./NoteFormatBarPopperHandheld";
import {NoteFormatBarExtensionButton} from "../NoteFormatBarButton";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";

interface INoteFormatBarPopperExtensionHandheldProps {
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

export const NoteFormatBarPopperHandheldExtension: React.FC<INoteFormatBarPopperExtensionHandheldProps> = (props) => {
    const { className, style, onEditTags, onUndo, onRedo } = props;
    const sharedClasses = useNoteFormatBarPopperHandheldStyles();
    const classes = useStyles();

    return (
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box py={3.75} px={2} className={classes.root}>

                <NoteFormatBarExtensionButton icon={<UndoIcon className={classes.icon} />}
                                              onClick={onUndo}>
                    Undo
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<RedoIcon className={classes.icon} />}
                                              onClick={onRedo}>
                    Redo
                </NoteFormatBarExtensionButton>

                <NoteFormatBarExtensionButton icon={<LocalOfferIcon className={classes.icon} />}
                                              onClick={onEditTags}>
                    Add tags
                </NoteFormatBarExtensionButton>
            </Box>
        </Paper>
    );
};


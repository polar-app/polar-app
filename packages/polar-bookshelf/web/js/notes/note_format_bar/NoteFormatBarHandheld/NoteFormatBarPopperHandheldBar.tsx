import React from "react";
import {Box, Paper, Divider, createStyles, makeStyles} from "@material-ui/core";
import {NoteFormatBarButton} from "../NoteFormatBarButton";
import {BacklinkIconButton} from "../../../mui/icon_buttons/BacklinkIconButton";
import {FABoldIcon, FAItalicIcon, FAStrikethroughIcon} from "../../../mui/MUIFontAwesome";
import {useExecCommandExecutor} from "../NoteFormatBarActions";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import clsx from "clsx";
import {useUndoQueue} from "../../../undo/UndoQueueProvider2";
import {useNoteFormatBarPopperHandheldStyles} from "./NoteFormatBarPopperHandheld";
import {useCreateBacklinkFromSelection} from "../../NoteUtils";
import {useBlocksStore} from "../../store/BlocksStore";

interface INoteFormatBarPopperHandheldBarProps {
    readonly onToggleExpand: () => void;
    readonly expanded: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const useStyles = makeStyles((theme) =>
    createStyles({
        icon: {
            padding: theme.spacing(0.25),
            color: theme.palette.text.secondary,
        },
        muiIcon: {
            fontSize: '1.5rem',
        },
        faIcon: {
            fontSize: '1.15rem',
        },
        divider: { margin: `${theme.spacing(0.75)}px ${theme.spacing(1.25)}px` },
        iconWrapper: {
            '& + &': {
                marginLeft: theme.spacing(2),
            },
        },
    })
);

export const NoteFormatBarPopperHandheldBar: React.FC<INoteFormatBarPopperHandheldBarProps> = (props) => {
    const { onToggleExpand, expanded, className, style } = props;

    const sharedClasses = useNoteFormatBarPopperHandheldStyles();
    const createBacklinkinkFromSelection = useCreateBacklinkFromSelection();
    const classes = useStyles();
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

    const handleHideKeyboard = React.useCallback(() => null, []);

    return (
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box p={0.7}
                 flex={1}
                 display="flex"
                 justifyContent="center"
                 alignItems="center">

                <NoteFormatBarButton icon={<KeyboardHideIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleHideKeyboard} />

                <Divider orientation="vertical" flexItem className={classes.divider} />

                <NoteFormatBarButton icon={<BacklinkIconButton className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleBacklink} />

                <NoteFormatBarButton icon={<FABoldIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleBold} />

                <NoteFormatBarButton icon={<FAItalicIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleItalic} />

                <NoteFormatBarButton icon={<FAStrikethroughIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleStrikeThrough} />

                <NoteFormatBarButton icon={<UndoIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleUndo} />

                <NoteFormatBarButton icon={<RedoIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={handleRedo} />

                <Divider orientation="vertical" flexItem className={classes.divider} />

                <NoteFormatBarButton icon={expanded
                                            ? <ExpandMoreIcon className={clsx(classes.icon, classes.muiIcon)} />
                                            : <ExpandLessIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     active={expanded}
                                     className={classes.iconWrapper}
                                     onClick={onToggleExpand} />

            </Box>
        </Paper>
    );
};

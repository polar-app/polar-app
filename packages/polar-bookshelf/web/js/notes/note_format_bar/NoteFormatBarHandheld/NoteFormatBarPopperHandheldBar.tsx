import React from "react";
import {Box, Paper, Divider, createStyles, makeStyles} from "@material-ui/core";
import {NoteFormatBarButton} from "../NoteFormatBarButton";
import {BacklinkIconButton} from "../../../mui/icon_buttons/BacklinkIconButton";
import {FABoldIcon, FAItalicIcon, FAStrikethroughIcon} from "../../../mui/MUIFontAwesome";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import clsx from "clsx";
import {useNoteFormatBarPopperHandheldStyles} from "./NoteFormatBarPopperHandheld";

interface INoteFormatBarPopperHandheldBarProps {
    readonly onToggleExpand: () => void;
    readonly expanded: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly onBold: () => void;
    readonly onItalic: () => void;
    readonly onStrikeThrough: () => void;
    readonly onUndo: () => void;
    readonly onRedo: () => void;
    readonly onBacklink: () => void;
    readonly onHideKeyboard: () => void;
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
    const {
        onToggleExpand,
        expanded,
        className,
        style,

        onHideKeyboard,
        onBacklink,
        onRedo,
        onUndo,
        onStrikeThrough,
        onItalic,
        onBold,
    } = props;

    const sharedClasses = useNoteFormatBarPopperHandheldStyles();
    const classes = useStyles();

    return (
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box p={0.7}
                 flex={1}
                 display="flex"
                 justifyContent="center"
                 alignItems="center">

                <NoteFormatBarButton icon={<KeyboardHideIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onHideKeyboard} />

                <Divider orientation="vertical" flexItem className={classes.divider} />

                <NoteFormatBarButton icon={<BacklinkIconButton className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onBacklink} />

                <NoteFormatBarButton icon={<FABoldIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onBold} />

                <NoteFormatBarButton icon={<FAItalicIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onItalic} />

                <NoteFormatBarButton icon={<FAStrikethroughIcon className={clsx(classes.icon, classes.faIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onStrikeThrough} />

                <NoteFormatBarButton icon={<UndoIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onUndo} />

                <NoteFormatBarButton icon={<RedoIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onRedo} />

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

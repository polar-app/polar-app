import React from "react";
import {Box, createStyles, Divider, makeStyles, Paper} from "@material-ui/core";
import {NoteFormatBarButton} from "../NoteFormatBarButton";
import {BacklinkIconButton} from "../../../mui/icon_buttons/BacklinkIconButton";
import {FABoldIcon, FAItalicIcon, FAStrikethroughIcon} from "../../../mui/MUIFontAwesome";
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import clsx from "clsx";
import {useNoteFormatBarPopperHandheldStyles} from "./NoteFormatBarPopperHandheld";
import FormatIndentDecreaseIcon from "@material-ui/icons/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@material-ui/icons/FormatIndentIncrease";

interface INoteFormatBarPopperHandheldBarProps {
    readonly onToggleExpand: () => void;
    readonly expanded: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly onBold: () => void;
    readonly onItalic: () => void;
    readonly onStrikeThrough: () => void;
    readonly onIndent: () => void;
    readonly onUnindent: () => void;
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
        onIndent,
        onUnindent,
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

                <NoteFormatBarButton icon={<FormatIndentDecreaseIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onUnindent}/>

                <NoteFormatBarButton icon={<FormatIndentIncreaseIcon className={clsx(classes.icon, classes.muiIcon)} />}
                                     className={classes.iconWrapper}
                                     onClick={onIndent}/>

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

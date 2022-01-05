import React from "react";
import {Box, Paper, Divider, createStyles, makeStyles} from "@material-ui/core";
import {BacklinkIconButton} from "../../../mui/icon_buttons/BacklinkIconButton";
import {FABoldIcon, FAItalicIcon, FAStrikethroughIcon} from "../../../mui/MUIFontAwesome";
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import clsx from "clsx";
import {useNoteFormatBarPopperMobileStyles} from "./NoteFormatBarPopperMobile";
import {NoteFormatBarActionIcon} from "../NoteFormatBarActionIcon";

interface INoteFormatBarPopperMobileBarProps {
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
        divider: { margin: `${theme.spacing(0.75)}px ${theme.spacing(1.25)}px` },
        iconWrapper: {
            padding: theme.spacing(0.25),
            '& + &': {
                marginLeft: theme.spacing(2.5),
            },
        },
    })
);

export const NoteFormatBarPopperMobileBar: React.FC<INoteFormatBarPopperMobileBarProps> = (props) => {
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

    const sharedClasses = useNoteFormatBarPopperMobileStyles();
    const classes = useStyles();

    return (
        <Paper className={clsx(sharedClasses.paperRoot, className)} style={style}>
            <Box p={0.7}
                 flex={1}
                 display="flex"
                 justifyContent="center"
                 alignItems="center">

                <NoteFormatBarActionIcon icon={KeyboardHideIcon}
                                         className={classes.iconWrapper}
                                         onClick={onHideKeyboard} />

                <Divider orientation="vertical" flexItem className={classes.divider} />

                <NoteFormatBarActionIcon icon={BacklinkIconButton}
                                         className={classes.iconWrapper}
                                         onClick={onBacklink} />

                <NoteFormatBarActionIcon icon={FABoldIcon}
                                         className={classes.iconWrapper}
                                         onClick={onBold} />

                <NoteFormatBarActionIcon icon={FAItalicIcon}
                                         className={classes.iconWrapper}
                                         onClick={onItalic} />

                <NoteFormatBarActionIcon icon={FAStrikethroughIcon}
                                         className={classes.iconWrapper}
                                         onClick={onStrikeThrough} />

                <NoteFormatBarActionIcon icon={FormatIndentDecreaseIcon}
                                         className={classes.iconWrapper}
                                         onClick={onUnindent} />

                <NoteFormatBarActionIcon icon={FormatIndentIncreaseIcon}
                                         className={classes.iconWrapper}
                                         onClick={onIndent} />

                <Divider orientation="vertical" flexItem className={classes.divider} />

                <NoteFormatBarActionIcon icon={expanded ? ExpandMoreIcon : ExpandLessIcon}
                                         active={expanded}
                                         className={classes.iconWrapper}
                                         onClick={onToggleExpand} />

            </Box>
        </Paper>
    );
};


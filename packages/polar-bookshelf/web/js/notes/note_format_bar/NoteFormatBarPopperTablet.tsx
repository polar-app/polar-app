import React from "react";
import {Box, createStyles, makeStyles, Paper} from "@material-ui/core";
import {useLinkDialog, useNoteFormatBarActions} from "./NoteFormatBarActions";
import {NoteFormatBarActionIcon} from "./NoteFormatBarActionIcon";
import {BacklinkIconButton} from "../../mui/icon_buttons/BacklinkIconButton";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import FormatIndentDecreaseIcon from '@material-ui/icons/FormatIndentDecrease';
import FormatIndentIncreaseIcon from '@material-ui/icons/FormatIndentIncrease';
import {FAItalicIcon, FALinkIcon, FAStrikethroughIcon} from "../../icons/MUIFontAwesome";
import {abortEvent} from "../contenteditable/BlockKeyboardHandlers";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            borderRadius: 0,
            overflowX: 'auto',
        },
        rootInner: {
            fontSize: '2rem',
        },
        iconWrapper: {
            padding: theme.spacing(0.25),
            '& + &': {
                marginLeft: theme.spacing(3),
            },
        },
    })
);

export const NoteFormatBarPopperTablet: React.FC = () => {
    const classes = useStyles();
    const linkDialog = useLinkDialog();

    const {
        handleItalic,
        handleStrikeThrough,
        handleBacklink,
        handleUndo,
        handleRedo,
        handleIndent,
        handleUnindent,
        handleEditTags,
        handleActionChange,
    } = useNoteFormatBarActions();

    const handleLinkAction = React.useCallback(() => {
        handleActionChange('link')();
        linkDialog();
    }, [handleActionChange, linkDialog]);

    return (
        <Paper className={classes.root} onMouseDown={abortEvent}>
            <Box p={1.5} display="flex" alignItems="center" justifyContent="space-around" className={classes.rootInner}>
                <NoteFormatBarActionIcon icon={BacklinkIconButton}
                                         className={classes.iconWrapper}
                                         onClick={handleBacklink} />

                <NoteFormatBarActionIcon icon={FAItalicIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleItalic} />

                <NoteFormatBarActionIcon icon={FAStrikethroughIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleStrikeThrough} />

                <NoteFormatBarActionIcon icon={UndoIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleUndo} />

                <NoteFormatBarActionIcon icon={RedoIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleRedo} />

                <NoteFormatBarActionIcon icon={FormatIndentIncreaseIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleIndent} />

                <NoteFormatBarActionIcon icon={FormatIndentDecreaseIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleUnindent} />

                <NoteFormatBarActionIcon icon={LocalOfferIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleEditTags} />

                <NoteFormatBarActionIcon icon={FALinkIcon}
                                         className={classes.iconWrapper}
                                         onClick={handleLinkAction} />
            </Box>
        </Paper>
    );
};

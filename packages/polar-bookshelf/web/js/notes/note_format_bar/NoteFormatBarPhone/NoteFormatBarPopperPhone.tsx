import React from "react";
import {createStyles, lighten, makeStyles} from "@material-ui/core";
import {NoteFormatBarPopperPhoneBar} from "./NoteFormatBarPopperPhoneBar";
import {NoteFormatBarPopperPhoneExtension} from "./NoteFormatBarPopperPhoneExtension";
import clsx from "clsx";
import {useNoteFormatBarActions} from "../NoteFormatBarActions";
import {abortEvent} from "../../contenteditable/BlockKeyboardHandlers";

const NOTE_FORMAT_BAR_POPPER_PHONE_EXTENSION_HEIGHT = 200;
const NOTE_FORMAT_BAR_POPPER_PHONE_BAR_HEIGHT = 42;

export const useNoteFormatBarPopperPhoneStyles = makeStyles((theme) =>
    createStyles({
        paperRoot: {
            borderRadius: 0,
            borderTop: `1px solid ${lighten(theme.palette.background.paper, 0.15)}`,
        },
        container: {
            width: '100%',
            overflow: 'hidden',
            height: NOTE_FORMAT_BAR_POPPER_PHONE_BAR_HEIGHT,
            willChange: 'height',
            transition: 'height 190ms ease-in-out',
            '&.open': {
                height: NOTE_FORMAT_BAR_POPPER_PHONE_BAR_HEIGHT
                        + NOTE_FORMAT_BAR_POPPER_PHONE_EXTENSION_HEIGHT,
            },
            fontSize: '1.55rem',
        },
        bar: {
            height: theme.spacing(5.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        extension: {
            height: NOTE_FORMAT_BAR_POPPER_PHONE_EXTENSION_HEIGHT,
            overflowY: 'auto',
        },
    })
);

export const NoteFormatBarPopperPhone: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useNoteFormatBarPopperPhoneStyles();

    const handleToggleExpand = React.useCallback(() =>
        setExpanded(expanded => ! expanded), []);

    const {
        handleUndo,
        handleRedo,

        handleBold,
        handleItalic,
        handleStrikeThrough,

        handleIndent,
        handleUnindent,

        handleBacklink,
        handleEditTags,
    } = useNoteFormatBarActions();

    return (
        <div className={clsx(classes.container, { open: expanded })} onMouseDown={abortEvent}>
            <NoteFormatBarPopperPhoneBar onToggleExpand={handleToggleExpand}
                                          className={classes.bar}
                                          expanded={expanded}

                                          onBold={handleBold}
                                          onItalic={handleItalic}
                                          onIndent={handleIndent}
                                          onUnindent={handleUnindent}
                                          onBacklink={handleBacklink}
                                          onStrikeThrough={handleStrikeThrough} />

            <NoteFormatBarPopperPhoneExtension className={classes.extension}
                                                onUndo={handleUndo}
                                                onRedo={handleRedo}
                                                onEditTags={handleEditTags} />
        </div>
    );
};

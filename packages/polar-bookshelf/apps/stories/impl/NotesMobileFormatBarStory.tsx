import React from "react";
import clsx from "clsx";
import {NoteFormatBarPopperMobileBar} from "../../../web/js/notes/note_format_bar/NoteFormatBarMobile/NoteFormatBarPopperMobileBar";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useNoteFormatBarPopperMobileStyles} from "../../../web/js/notes/note_format_bar/NoteFormatBarMobile/NoteFormatBarPopperMobile";
import {NoteFormatBarPopperMobileExtension} from "../../../web/js/notes/note_format_bar/NoteFormatBarMobile/NoteFormatBarPopperMobileExtension";
import {Box, createStyles, makeStyles, TextField} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        '@global': {
            'html, body': {
                fontSize: 16,
            }
        }
    })
);

export const NotesMobileFormatBarStory: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useNoteFormatBarPopperMobileStyles();
    const [width, setWidth] = React.useState<string>("100%");

    useStyles();

    const handleToggleExpand = React.useCallback(() =>
        setExpanded(expanded => ! expanded), []);

    const handleWidthChange = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setWidth(evt.target.value);
    }, [setWidth]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            <Box flex="1" display="flex" flexDirection="column" alignItems="center">
                <h1>Notes Format Bar</h1>
                <TextField onChange={handleWidthChange} value={width} label="Width" />
            </Box>
            <Box className={clsx(classes.container, { open: expanded })} style={{ width }}>

                <NoteFormatBarPopperMobileBar onBold={NULL_FUNCTION}
                                              onItalic={NULL_FUNCTION}
                                              onIndent={NULL_FUNCTION}
                                              onUnindent={NULL_FUNCTION}
                                              onBacklink={NULL_FUNCTION}
                                              onHideKeyboard={NULL_FUNCTION}
                                              onStrikeThrough={NULL_FUNCTION}
                                              expanded={expanded}
                                              onToggleExpand={handleToggleExpand} />

                <NoteFormatBarPopperMobileExtension className={classes.extension}
                                                    onEditTags={NULL_FUNCTION}
                                                    onUndo={NULL_FUNCTION}
                                                    onRedo={NULL_FUNCTION} />
            </Box>
        </Box>
    );
};

import React from "react";
import {createStyles, lighten, makeStyles} from "@material-ui/core";
import {NoteFormatBarPopperHandheldBar} from "./NoteFormatBarPopperHandheldBar";
import {NoteFormatBarPopperHandheldExtension} from "./NoteFormatBarPopperHandheldExtension";
import clsx from "clsx";

const NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT = 200;
const NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT = 42;

export const useNoteFormatBarPopperHandheldStyles = makeStyles((theme) =>
    createStyles({
        paperRoot: {
            borderRadius: 0,
            borderTop: `1px solid ${lighten(theme.palette.background.paper, 0.15)}`,
        },
        container: {
            width: '100%',
            overflow: 'hidden',
            height: NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT,
            willChange: 'height',
            transition: 'height 190ms ease-in-out',
            '&.open': {
                height: NOTE_FORMAT_BAR_POPPER_HANDHELD_BAR_HEIGHT
                        + NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT,
            },
        },
        bar: {
            height: theme.spacing(5.5),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        extension: {
            height: NOTE_FORMAT_BAR_POPPER_HANDHELD_EXTENSION_HEIGHT,
            overflowY: 'auto',
        },
    })
);


export const NoteFormatBarPopperHandheld: React.FC = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useNoteFormatBarPopperHandheldStyles();

    const handleToggleExpand = React.useCallback(() => 
        setExpanded(expanded => ! expanded), []);

    const abortEvent = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <div className={clsx(classes.container, { open: expanded })} onMouseDown={abortEvent}>
            <NoteFormatBarPopperHandheldBar onToggleExpand={handleToggleExpand}
                                            className={classes.bar}
                                            expanded={expanded} />

            <NoteFormatBarPopperHandheldExtension className={classes.extension} />
        </div>
    );
};

import React from "react";
import {NoteTargetStr} from "./NoteLinkLoader";
import IconButton from "@material-ui/core/IconButton";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNoteActivated, useNotesStore} from "./NotesStore";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import {useNoteContextMenu} from "./Note";
import {NoteButton} from "./NoteButton";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint,
            fontSize: '1.0em',
            width: '1.0em',
            height: '1.0em'
        },
    }),
);
interface IProps {
    readonly id: NoteIDStr;
}

export const NoteOverflowButton = deepMemo(function NoteOverflow(props: IProps) {

    const noteActivated = useNoteActivated(props.id)
    const classes = useStyles();
    const contextMenuHandlers = useNoteContextMenu();

    const className=clsx(classes.root, 'NoteOverflow');

    if (noteActivated?.note.id !== props.id) {
        return <div className={className}/>;
    }

    return (
        <div>
            <MoreVertIcon onClick={event => contextMenuHandlers.onContextMenu(event)}
                          className={classes.root}/>
        </div>
    );
})


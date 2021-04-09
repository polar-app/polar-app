import React from "react";
import {deepMemo} from "../react/ReactUtils";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import {useNoteContextMenu} from "./Note";
import { NoteIDStr, useNotesStore } from "./store/BlocksStore";
import { observer } from "mobx-react-lite"

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

export const NoteOverflowButton = observer(function NoteOverflow(props: IProps) {

    const store = useNotesStore();
    const classes = useStyles();
    const contextMenuHandlers = useNoteContextMenu();

    const noteActivated = store.getNoteActivated(props.id);

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


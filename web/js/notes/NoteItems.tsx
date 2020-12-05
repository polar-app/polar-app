import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { Note } from "./Note";
import {INote, NoteIDStr} from "./NotesStore";
import {UL} from "./UL";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            // borderLeft: `1px solid ${theme.palette.divider}`
        },
    }),
);

interface NotesProps {
    readonly parent: NoteIDStr;
    readonly notes: ReadonlyArray<INote> | undefined;
}

export const NoteItems = deepMemo(function NoteItems(props: NotesProps) {

    const classes = useStyles();

    if ( ! props.notes) {
        return null;
    }

    return (

        <UL className={clsx(classes.root, 'NoteItems')}>
            <>
                {props.notes.map((note) => (
                    <Note key={note.id}
                          parent={props.parent}
                          id={note.id}/>))}
            </>
        </UL>

    );

});


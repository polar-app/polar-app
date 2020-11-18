import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";

interface IProps extends INote {

}

export const Note = React.memo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesCallbacks();

    const notes = lookup(props.items || []);

    return (
        <>
            <NoteEditor content={props.content}/>
            <Notes notes={notes}/>
        </>
    );
});
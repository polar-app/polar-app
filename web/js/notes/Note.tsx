import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";

interface IProps extends INote {

}

export const Note = deepMemo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesCallbacks();

    const notes = lookup(props.items || []);

    return (
        <>
            <NoteEditor id={props.id} content={props.content}/>
            <Notes notes={notes}/>
        </>
    );
});
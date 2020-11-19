import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, NoteIDStr, useNotesCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";

interface IProps extends INote {
    readonly parent: NoteIDStr;
}

export const Note = deepMemo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesCallbacks();

    const notes = lookup(props.items || []);

    return (
        <>
            <NoteEditor parent={props.parent} id={props.id} content={props.content}/>
            <Notes parent={props.parent} notes={notes}/>
        </>
    );
});
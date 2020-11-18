import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesCallbacks} from "./NotesStore";
import {Notes} from "./Notes";

interface IProps {
    readonly notes: ReadonlyArray<NoteIDStr>;
}

export const NotesRoot = deepMemo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesCallbacks();

    const notes = lookup(props.notes);

    return (
        <Notes notes={notes}/>
    );

});

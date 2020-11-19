import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesCallbacks} from "./NotesStore";
import {Notes} from "./Notes";
import {isPresent} from "polar-shared/src/Preconditions";

interface IProps {
    readonly id: NoteIDStr;
}

export const NoteRoot = deepMemo((props: IProps) => {

    const {index} = useNotesStore(['index']);
    const {lookup} = useNotesCallbacks();

    const note = index[props.id];

    if (! isPresent(note)) {
        return (
            <div>No note</div>
        );
    }

    const notes = lookup(note.items || []);

    return (
        <div>

            {note.name && (
                <h1>{note.name}</h1>
            )}

            {note.content && (
                <p>{note.content}</p>
            )}

            <Notes parent={props.id} notes={notes}/>

        </div>
    );

});

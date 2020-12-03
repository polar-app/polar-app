import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { Note } from "./Note";
import {INote, NoteIDStr} from "./NotesStore";
import {UL} from "./UL";

interface NotesProps {
    readonly parent: NoteIDStr;
    readonly notes: ReadonlyArray<INote> | undefined;
}

export const Notes = deepMemo(function Notes(props: NotesProps) {

    if ( ! props.notes) {
        return null;
    }

    return (

        <UL style={{flexGrow: 1}} className="Notes">
            <>
                {props.notes.map((note) => (
                    <Note key={note.id}
                          parent={props.parent}
                          id={note.id}/>))}
            </>
        </UL>

    );

});


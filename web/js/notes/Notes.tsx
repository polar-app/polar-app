import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { Note } from "./Note";
import {INote, NoteIDStr} from "./NotesStore";
import {MiddleDot} from "./MiddleDot";
import {UL} from "./UL";

interface NotesProps {
    readonly parent: NoteIDStr;
    readonly notes: ReadonlyArray<INote> | undefined;
}

export const Notes = deepMemo((props: NotesProps) => {

    if ( ! props.notes) {
        return null;
    }

    return (

        <UL style={{flexGrow: 1}}>
            <>
                {props.notes.map((note) => (
                    <Note key={note.id} parent={props.parent} {...note}/>))}
            </>
        </UL>

    );

});

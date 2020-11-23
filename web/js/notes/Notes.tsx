import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { Note } from "./Note";
import {INote, NoteIDStr} from "./NotesStore";
import {MiddleDot} from "./MiddleDot";
import {NoteList} from "./NoteList";

interface NotesProps {
    readonly parent: NoteIDStr;
    readonly notes: ReadonlyArray<INote> | undefined;
}

export const Notes = deepMemo((props: NotesProps) => {

    if ( ! props.notes) {
        return null;
    }

    return (

        <NoteList style={{flexGrow: 1}}>
            <>
                {props.notes.map((note) => (
                    <div key={note.id}
                         style={{
                             display: 'flex'
                         }}>

                        <MiddleDot style={{fontSize: '2.25em'}}/>

                        <Note parent={props.parent} {...note}/>

                    </div>))}
            </>
        </NoteList>

    );

});

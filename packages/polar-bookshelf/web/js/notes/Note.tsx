import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {NoteBullet} from "./ NoteBullet";
import {useLifecycleTracer} from "../hooks/ReactHooks";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;

}

export const Note = deepMemo(function Note(props: IProps) {

    useLifecycleTracer('Note');

    const {id} = props;
    const {index} = useNotesStore(['index']);
    const {lookup} = useNotesStoresCallbacks();

    const note = index[id];

    const notes = lookup(note.items || []);

    return (
        <>
            <div className="Note"
                 style={{display: 'flex'}}>

                <div style={{
                         marginTop: 'auto',
                         marginBottom: 'auto'
                     }}>

                    <NoteBullet target={props.id}/>

                </div>

                <NoteEditor parent={props.parent} id={props.id} />

            </div>

            <Notes parent={props.parent} notes={notes}/>
        </>
    );
});


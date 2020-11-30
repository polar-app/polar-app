import React from "react";
import {NoteEditor} from "./NotesEditor";
import {NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {NoteBullet} from "./ NoteBullet";

interface IProps {
    readonly parent: NoteIDStr;
    readonly id: NoteIDStr;
    readonly content?: string;
    readonly items?: ReadonlyArray<NoteIDStr>;

}

export const Note = deepMemo(function Note(props: IProps) {

    useNotesStore(['index']);
    const {lookup} = useNotesStoresCallbacks();

    const notes = lookup(props.items || []);

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

                <NoteEditor parent={props.parent} id={props.id} content={props.content}/>

            </div>

            <Notes parent={props.parent} notes={notes}/>
        </>
    );
});


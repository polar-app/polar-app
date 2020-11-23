import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {MiddleDot} from "./MiddleDot";

interface IProps extends INote {
    readonly parent: NoteIDStr;
}

export const Note = deepMemo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesStoresCallbacks();

    const notes = lookup(props.items || []);

    return (
        <>
            <div style={{display: 'flex'}}>

                <MiddleDot style={{
                               marginTop: 'auto',
                               marginBottom: 'auto'
                           }}/>

                <NoteEditor parent={props.parent} id={props.id} content={props.content}/>
                
            </div>

            <Notes parent={props.parent} notes={notes}/>
        </>
    );
});
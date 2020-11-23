import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";

interface IProps extends INote {
    readonly parent: NoteIDStr;
}

export const Note = deepMemo((props: IProps) => {

    useNotesStore(['index']);
    const {lookup} = useNotesStoresCallbacks();

    const notes = lookup(props.items || []);

    return (
        <div style={{flexGrow: 1}} className="Note">
            <NoteEditor parent={props.parent} id={props.id} content={props.content}/>
            <Notes parent={props.parent} notes={notes}/>
        </div>
    );
});
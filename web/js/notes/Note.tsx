import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote, NoteIDStr, useNotesStoresCallbacks, useNotesStore} from "./NotesStore";
import {Notes} from "./Notes";
import { deepMemo } from "../react/ReactUtils";
import {MiddleDot} from "./MiddleDot";
import IconButton from "@material-ui/core/IconButton";
import {useNoteLinkLoader} from "./NoteLinkLoader";
import {NoteBullet} from "./ NoteBullet";

interface IProps extends INote {
    readonly parent: NoteIDStr;
}

export const Note = deepMemo((props: IProps) => {

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

Note.displayName='Note';
import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoresCallbacks} from "./NotesStore";
import {Notes} from "./Notes";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {CKEditor5BalloonEditor} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly id: NoteIDStr;
}
export const NoteRoot = deepMemo(function NoteRoot(props: IProps) {

    const {index, indexByName} = useNotesStore(['index', 'indexByName']);
    const {lookup} = useNotesStoresCallbacks();

    const note = index[props.id] || indexByName[props.id];

    if (! isPresent(note)) {
        return (
            <div>No note for id: {props.id}</div>
        );
    }

    const id = note?.id;

    const notes = lookup(note.items || []);

    return (
        <MUIBrowserLinkStyle style={{flexGrow: 1}}>

            <div className="NoteRoot">

                {note.name && (
                    <h1>{note.name}</h1>
                )}

                {note.content && (
                    // <p>{note.content}</p>
                    <CKEditor5BalloonEditor content={note.content || ''}
                                            onChange={NULL_FUNCTION}
                                            onEditor={NULL_FUNCTION}/>)}

                <Notes parent={id} notes={notes}/>

                <NotesInbound id={id}/>

            </div>

        </MUIBrowserLinkStyle>
    );

});

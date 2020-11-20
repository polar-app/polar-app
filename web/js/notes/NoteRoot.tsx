import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoresCallbacks} from "./NotesStore";
import {Notes} from "./Notes";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NoteNavigation} from "./NoteNavigation";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly id: NoteIDStr;
}

export const NoteRoot = deepMemo((props: IProps) => {

    const {index} = useNotesStore(['index']);
    const {lookup} = useNotesStoresCallbacks();

    const note = index[props.id];

    if (! isPresent(note)) {
        return (
            <div>No note</div>
        );
    }

    const notes = lookup(note.items || []);

    return (
        <MUIBrowserLinkStyle>
            <div>

                {note.name && (
                    <h1>{note.name}</h1>
                )}

                {note.content && (
                    // <p>{note.content}</p>
                    <CKEditor5 content={note.content || ''} onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>

                    )}

                <Notes parent={props.id} notes={notes}/>

                <NotesInbound id={props.id}/>

            </div>
        </MUIBrowserLinkStyle>
    );

});

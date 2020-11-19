import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoresCallbacks} from "./NotesStore";
import {Notes} from "./Notes";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";

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
                    <p>{note.content}</p>
                )}

                <Notes parent={props.id} notes={notes}/>

                <NotesInbound id={props.id}/>

            </div>
        </MUIBrowserLinkStyle>
    );

});

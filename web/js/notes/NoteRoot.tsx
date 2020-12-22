import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNoteFromStore, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import {useLifecycleTracer} from "../hooks/ReactHooks";

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = deepMemo(function NoteRoot(props: IProps) {

    useLifecycleTracer('NoteRoot');

    const {setRoot, setActive} = useNotesStoreCallbacks();

    const note = useNoteFromStore(props.target);

    console.log("FIXME: rendered with note ID: ", note?.id);

    React.useEffect(() => {
        // TODO: do this with one init() operation so it mutates the store just once.

        if (note) {
            setRoot(note.id);
            setActive(note.id);
        }

    }, [note, setActive, setRoot])

    if (! note) {
        return (
            <div>No note for target: {props.target}</div>
        );
    }

    const id = note?.id;

    return (
        <NoteStyle>
            <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                <Note parent={undefined} id={id} isExpanded={true}/>

                <NotesInbound id={id}/>

            </MUIBrowserLinkStyle>
        </NoteStyle>
    );

});

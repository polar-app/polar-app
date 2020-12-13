import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = deepMemo(function NoteRoot(props: IProps) {

    const {index, indexByName} = useNotesStore(['index', 'indexByName']);
    const {setRoot} = useNotesStoreCallbacks();

    const note = index[props.target] || indexByName[props.target];

    React.useEffect(() => {
        setRoot(note.id);
    }, [note.id, setRoot])

    if (! isPresent(note)) {
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

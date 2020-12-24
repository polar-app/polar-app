import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import { NoteIDStr, NotesStoreProvider } from "./NotesStore2";
import { useNotesStore } from "./NotesStore2";

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = deepMemo(function NoteRoot(props: IProps) {

    useLifecycleTracer('NoteRoot');

    const {target} = props;

    const store = useNotesStore();

    const note = store.getNoteByTarget(target)

    React.useEffect(() => {
        // TODO: do this with one init() operation so it mutates the store just once.

        if (note) {
            store.setRoot(note.id);
            store.setActive(note.id);
        }

    }, [note, store])

    if (! note) {
        return (
            <div>No note for target: {props.target}</div>
        );
    }

    const id = note?.id;

    return (
        <NotesStoreProvider>
            <>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                        <Note parent={undefined} id={id} isExpanded={true}/>

                        <NotesInbound id={id}/>

                    </MUIBrowserLinkStyle>
                </NoteStyle>
            </>
        </NotesStoreProvider>
    );

});

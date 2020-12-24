import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import { NoteIDStr, NotesStoreProvider } from "./NotesStore2";
import { useNotesStore } from "./NotesStore2";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = observer(function NoteRoot(props: IProps) {

    useLifecycleTracer('NoteRoot', {target: props.target});

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
        <>
            <NoteStyle>
                <MUIBrowserLinkStyle style={{flexGrow: 1}}>

                    <Note parent={undefined} id={id} isExpanded={true}/>

                    <NotesInbound id={id}/>

                </MUIBrowserLinkStyle>
            </NoteStyle>
        </>
    );

});

import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";
import { NoteStyle } from "./NoteStyle";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import { NoteIDStr, NotesStoreProvider } from "./store/NotesStore";
import { useNotesStore } from "./store/NotesStore";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = observer((props: IProps) => {

    // useLifecycleTracer('NoteRoot', {target: props.target});

    const {target} = props;

    const store = useNotesStore();

    const note = store.getNoteByTarget(target)

    React.useEffect(() => {
        // TODO: do this with one init() operation so it mutates the store just once.

        // FIXME: this won't actually work well because once we add it, as we're surfing
        // we're going to keep expanding / collapsing the nodes.

        if (note) {
            console.log("FIXME: effect: Setting root to: " + note.id);
            store.setRoot(note.id);
            store.setActive(note.id);
        } else {
            console.warn("FIXME: No note for target: ", target);
        }

    }, [note, store, target])

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

                    <Note parent={undefined} id={id}/>

                    <NotesInbound id={id}/>

                </MUIBrowserLinkStyle>
            </NoteStyle>
        </>
    );

});

import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {NoteItems} from "./NoteItems";
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
    const {lookup, setRoot} = useNotesStoreCallbacks();

    const note = index[props.id] || indexByName[props.id];

    if (! isPresent(note)) {
        return (
            <div>No note for id: {props.id}</div>
        );
    }

    React.useEffect(() => {
        setRoot(props.id);
    }, [props.id, setRoot])

    const id = note?.id;

    const notes = lookup(note.items || []);

    // FIXME: CKEditor5BalloonEditor should not be used
    // FIXME: h1 should not be used and shod we have note names PERIOD?
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

                <NoteItems parent={id} notes={notes}/>

                <NotesInbound id={id}/>

            </div>

        </MUIBrowserLinkStyle>
    );

});

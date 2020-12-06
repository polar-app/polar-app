import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {NoteItems} from "./NoteItems";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {CKEditor5BalloonEditor} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { NoteEditor } from "./NoteEditor";
import { Note } from "./Note";

interface INoteTitleProps {
    readonly children: string | JSX.Element;
}

const NoteTitle = React.memo((props: INoteTitleProps) => {
    return (
        <div style={{fontSize: '1.3em'}}>{props.children}</div>
    )
});

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

            <Note parent={undefined} id={id}/>

            <NotesInbound id={id}/>

            {/*<div className="NoteRoot">*/}

            {/*    {note.name && (*/}
            {/*        <NoteTitle>{note.name}</NoteTitle>*/}
            {/*    )}*/}


            {/*    {note.content && (*/}
            {/*        <NoteTitle>*/}
            {/*            <NoteEditor parent={undefined} id={id}/>*/}
            {/*        </NoteTitle>*/}
            {/*    )}*/}

            {/*    <NoteItems parent={id} notes={notes}/>*/}

            {/*    <NotesInbound id={id}/>*/}

            {/*</div>*/}

        </MUIBrowserLinkStyle>
    );

});

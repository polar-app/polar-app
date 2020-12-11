import React from "react";
import {deepMemo} from "../react/ReactUtils";
import {NoteIDStr, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {isPresent} from "polar-shared/src/Preconditions";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import { Note } from "./Note";

interface IProps {
    readonly target: NoteIDStr;
}

export const NoteRoot = deepMemo(function NoteRoot(props: IProps) {

    const {index, indexByName} = useNotesStore(['index', 'indexByName']);
    const {setRoot} = useNotesStoreCallbacks();

    const note = index[props.target] || indexByName[props.target];

    if (! isPresent(note)) {
        return (
            <div>No note for target: {props.target}</div>
        );
    }

    React.useEffect(() => {
        setRoot(note.id);
    }, [note.id, setRoot])

    const id = note?.id;

    // FIXME: CKEditor5BalloonEditor should not be used
    // FIXME: h1 should not be used and shod we have note names PERIOD?
    return (
        <MUIBrowserLinkStyle style={{flexGrow: 1}}>

            <Note parent={undefined} id={id} isExpanded={true}/>

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

import React from "react";
import {NoteEditor} from "./NotesEditor";
import {INote} from "polar-shared/src/metadata/INote";

interface IProps extends INote {

}

export const Note = React.memo((props: IProps) => {

    const items = props.items || [];
    const children = items.map(current => notesIndex[current]);

    return (
        <>
            <NoteEditor content={props.content}/>
            <Notes notes={children}/>
        </>
    );
});
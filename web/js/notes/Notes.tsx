import React from "react";

import {deepMemo} from "../react/ReactUtils";
import {INote} from "polar-shared/src/metadata/INote";

interface NotesProps {
    readonly notes: ReadonlyArray<INote> | undefined;
}

export const Notes = deepMemo((props: NotesProps) => {

    if ( ! props.notes) {
        return null;
    }

    return (

        <ul style={{flexGrow: 1}}>

            {props.notes.map((note) => (
                <li style={{
                        listStyleType: 'disc'
                    }}
                    key={note.id}>
                    <Note {...note}/>
                </li>))}

        </ul>

    );

});

import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {NoteScreen} from "./NoteScreen";
import {JumpToNoteKeyboardCommand} from "./JumpToNoteKeyboardCommand";

export const NotesRouter = deepMemo(function NotesRouter()  {

    return (
        <>
            <NoteScreen/>
            <JumpToNoteKeyboardCommand/>
        </>
    )

});

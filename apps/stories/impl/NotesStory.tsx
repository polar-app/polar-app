import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {CKEditor5} from "./ckeditor5/CKEditor5";
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import ListItemText from '@material-ui/core/ListItemText';
import {createRXJSStore} from "../../../web/js/react/store/RXJSStore";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IDStr} from "polar-shared/src/util/Strings";
import {NoteEditor} from "../../../web/js/notes/NotesEditor";

// import '@ckeditor/ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css';

// sets up finder and context


export const [NoteMenuSelectedStoreProvider, useNoteMenuSelectedStore, useNoteMenuSelectedListener] =
    createRXJSStore<string | undefined>();

const notes: ReadonlyArray<INote> = [
    {
        id: '101',
        content: 'first note',
    },
    {
        id: '102',
        content: 'this is an item with some child items',
        items: [
            '103'
        ]
    },
    {
        id: '103',
        content: 'this is the second note',
    }
]

function createNotesIndex(): NotesIndex {

    const result: NotesIndex = {};

    for (const note of notes) {
        result[note.id] = note;
    }

    return result;

}

const notesIndex: NotesIndex = createNotesIndex();

type ReverseIndex = {[key: string]: ReadonlyArray<INote>};

const reverseIndex: ReverseIndex = {};

export const NotesStory = () => {

    return (
        <>
            <Notes notes={notes}/>

        </>
    );

}


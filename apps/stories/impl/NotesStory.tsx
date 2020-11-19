import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {createRXJSStore} from "../../../web/js/react/store/RXJSStore";
import {INote, NotesStoreProvider, useNotesCallbacks} from '../../../web/js/notes/NotesStore';
import {NoteRoot} from "../../../web/js/notes/NoteRoot";

export const [NoteMenuSelectedStoreProvider, useNoteMenuSelectedStore, useNoteMenuSelectedListener] =
    createRXJSStore<number | undefined>();

const notes: ReadonlyArray<INote> = [
    {
        id: '101',
        name: "This is your first note",
        content: 'first note',
    },
    {
        id: '102',
        name: "This is your second note",
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

interface BasicNotesDataSetProps {
    readonly children: JSX.Element;
}

const NotesInner = () => (
    <NoteRoot id='102'/>
);

const BasicNotesDataSet = (props: BasicNotesDataSetProps) => {

    const {doPut} = useNotesCallbacks();

    React.useMemo(() => doPut(notes), [doPut]);

    return props.children;

}

export const NotesStory = () => {

    return (
        <NotesStoreProvider>
            <BasicNotesDataSet>
                <NotesInner/>
            </BasicNotesDataSet>
        </NotesStoreProvider>
    );

}


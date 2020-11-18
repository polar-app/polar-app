import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {createRXJSStore} from "../../../web/js/react/store/RXJSStore";
import {INote, NotesStoreProvider, useNotesCallbacks} from '../../../web/js/notes/NotesStore';
import {NotesRoot} from "../../../web/js/notes/NotesRoot";

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

interface BasicNotesDataSetProps {
    readonly children: JSX.Element;
}

const NotesInner = () => (
    <NotesRoot notes={['101', '102']}/>
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


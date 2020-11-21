import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {INote, NotesStoreProvider, useNotesStoresCallbacks, useNotesStore} from '../../../web/js/notes/NotesStore';
import {NoteRoot} from "../../../web/js/notes/NoteRoot";

const notes: ReadonlyArray<INote> = [
    {
        id: '101',
        name: "This is your first note",
        content: 'first note',
    },
    {
        id: '102',
        name: "World War II",
        content: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
        items: [
            '103',
            '104',
            '105'
        ]
    },
    {
        id: '103',
        content: '<a href="https://www.example.com">Lasted</a> from 1939 to 1945',
    },
    {
        id: '104',
        content: 'Axis Powers: Germany, Italy, Japan',
    },
    {
        id: '105',
        content: 'Allied Powers: United States, United Kingdom, Canada, Russia',
        items: [
            '106'
        ]
    },
    {
        id: '106',
        content: 'Lead by Franklin D. Roosevelt, Winston Churchill, and Joseph Stalin ',
    },
    {
        id: '107',
        content: 'Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of World War II',
        items: [
            '102'
        ]
    },

]

interface BasicNotesDataSetProps {
    readonly children: JSX.Element;
}

const NotesStoryDebug = React.memo(() => {

    const {index, active} = useNotesStore(['index', 'active']);

    return (
        <div>
            <b>active: </b><br/>
            <pre>
            {JSON.stringify(active, null, '  ')}
            </pre>
            <b>index: </b><br/>
            <pre>
            {JSON.stringify(index, null, '  ')}
            </pre>
        </div>
    );
});

const NotesInner = () => (
    <div style={{display: 'flex'}}>
        <NoteRoot id='102'/>
        {/*<div style={{*/}
        {/*         width: '500px',*/}
        {/*         fontSize: '10px',*/}
        {/*         overflow: 'auto'*/}
        {/*     }}>*/}

        {/*    <NotesStoryDebug/>*/}

        {/*</div>*/}
    </div>
);

const BasicNotesDataSet = (props: BasicNotesDataSetProps) => {

    const {doPut} = useNotesStoresCallbacks();

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


import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {INote, NotesStoreProvider, useNotesStoresCallbacks, useNotesStore} from '../../../web/js/notes/NotesStore';
import {NotesRouter} from "../../../web/js/notes/NotesRouter";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { CKEditor5AppRoot } from './ckeditor5/CKEditor5AppRoot';

const now = ISODateTimeStrings.create();

const notes: ReadonlyArray<INote> = [
    {
        id: '102',
        created: now,
        updated: now,
        name: "World War II",
        items: [
            '103',
            '104',
            '105'
        ]
    },
    {
        id: '100',
        created: now,
        updated: now,
        content: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
    },
    {
        id: '103',
        created: now,
        updated: now,
        content: '[Lasted](https://www.example.com) from 1939 to 1945',
    },
    {
        id: '104',
        created: now,
        updated: now,
        content: 'Axis Powers: Germany, Italy, Japan',
    },
    {
        id: '108',
        created: now,
        updated: now,
        name: "Russia",
        items: [
        ]
    },
    {
        id: '109',
        created: now,
        updated: now,
        name: "Canada",
        items: [
            '111'
        ]
    },
    {
        id: '111',
        created: now,
        updated: now,
        content: 'Canada is north of the United States',
    },
    // FIXME: make text references NODE IDs...
    {
        id: '105',
        created: now,
        updated: now,
        content: 'Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].',
        links: ['109', '108'],
        items: [
            '106'
        ]
    },
    {
        id: '106',
        created: now,
        updated: now,
        content: 'Lead by Franklin D. Roosevelt, Winston Churchill, and Joseph Stalin ',
    },
    {
        id: '107',
        created: now,
        updated: now,
        name: "Germany",
        links: ['102'],
        items: [
            '110'
        ]
    },
    {
        id: '110',
        created: now,
        updated: now,
        content: 'Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]',
        links: [
            '100'
        ]
    }

]

interface BasicNotesDataSetProps {
    readonly children: JSX.Element;
}

const NotesStoryDebug = React.memo(() => {

    const {index, reverse, active} = useNotesStore(['index', 'reverse', 'active']);

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
            <b>reverse: </b><br/>
            <pre>
            {JSON.stringify(reverse, null, '  ')}
            </pre>
        </div>
    );
});

const NotesInner = () => (
    <div className="NotesInner"
         style={{
             display: 'flex',
             flexGrow: 1
         }}>

        <NotesRouter/>

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
        <CKEditor5AppRoot>
            <NotesStoreProvider>
                <BasicNotesDataSet>
                    <NotesInner/>
                </BasicNotesDataSet>
            </NotesStoreProvider>
        </CKEditor5AppRoot>
    );

}


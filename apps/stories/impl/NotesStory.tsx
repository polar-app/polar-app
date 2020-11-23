import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {INote, NotesStoreProvider, useNotesStoresCallbacks, useNotesStore} from '../../../web/js/notes/NotesStore';
import {NotesRouter} from "../../../web/js/notes/NotesRouter";

const notes: ReadonlyArray<INote> = [
    {
        id: '102',
        name: "World War II",
        items: [
            '103',
            '104',
            '105'
        ]
    },
    {
        id: '100',
        content: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
    },
    {
        id: '103',
        content: '[[Lasted]](https://www.example.com) from 1939 to 1945',
    },
    {
        id: '104',
        content: 'Axis Powers: Germany, Italy, Japan',
    },
    {
        id: '108',
        name: "Russia",
        items: [
        ]
    },
    {
        id: '109',
        name: "Canada",
        items: [
            '111'
        ]
    },
    {
        id: '111',
        content: 'Canada is north of the United States',
    },
    {
        id: '105',
        content: 'Allied Powers: United States, United Kingdom, [Canada](#Canada), [Russia](#Russia)',
        links: ['109', '108'],
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
        name: "Germany",
        links: ['102'],
        items: [
            '110'
        ]
    },
    {
        id: '110',
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
    <div style={{display: 'flex'}}>
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
        <NotesStoreProvider>
            <BasicNotesDataSet>
                <NotesInner/>
            </BasicNotesDataSet>
        </NotesStoreProvider>
    );

}


import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {INote, NotesStoreProvider, useNotesStoreCallbacks, useNotesStore} from '../../../web/js/notes/NotesStore';
import {NotesRouter} from "../../../web/js/notes/NotesRouter";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import { CKEditor5AppRoot } from './ckeditor5/CKEditor5AppRoot';
import Fab from '@material-ui/core/Fab';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {CKEditor5NotesGlobalCSS} from "../../../web/js/notes/CKEditor5NotesGlobalCSS";

const now = ISODateTimeStrings.create();

const notes: ReadonlyArray<INote> = [
    {
        id: '102',
        created: now,
        updated: now,
        content: "World War II",
        type: 'named',
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
        type: 'item',
        content: 'World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world\'s countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.',
    },
    {
        id: '103',
        created: now,
        updated: now,
        type: 'item',
        content: '[Lasted](https://www.example.com) from 1939 to 1945',
    },
    {
        id: '104',
        created: now,
        updated: now,
        type: 'item',
        content: 'Axis Powers: Germany, Italy, Japan',
    },
    {
        id: '108',
        created: now,
        updated: now,
        content: "Russia",
        type: 'named',
        items: [
        ]
    },
    {
        id: '109',
        created: now,
        updated: now,
        content: "Canada",
        type: 'named',
        items: [
            '111'
        ]
    },
    {
        id: '111',
        created: now,
        updated: now,
        type: 'item',
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
        ],
        type: 'item',
    },
    {
        id: '106',
        created: now,
        updated: now,
        content: 'Lead by Franklin D. Roosevelt, Winston Churchill, and Joseph Stalin ',
        type: 'item',
    },
    {
        id: '107',
        created: now,
        updated: now,
        content: "Germany",
        type: 'named',
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
        type: 'item',
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

const NotesStoryDebugButton = () => {

    const [active, setActive] = React.useState(false);

    return (
        <>

            {active && (
                <Dialog open={active} maxWidth="xl" onClose={() => setActive(false)}>
                    <DialogContent>
                        <NotesStoryDebug/>
                    </DialogContent>
                </Dialog>
            )}

            <Fab color="primary"
                 style={{
                     zIndex: 10,
                     position: 'absolute',
                     right: '20px',
                     bottom: '20px'
                 }}
                 onClick={() => setActive(true)}>
                <HelpIcon/>
            </Fab>
        </>
    )
}

const NotesInner = () => (
    <div className="NotesInner"
         style={{
             display: 'flex',
             flexGrow: 1
         }}>

        <NotesRouter/>

        <NotesStoryDebugButton/>

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

    const {doPut} = useNotesStoreCallbacks();

    React.useMemo(() => doPut(notes), [doPut]);

    return props.children;

}

interface FixedWidthContainer {
    readonly children: JSX.Element;
}

const FixedWidthContainer = React.memo((props: FixedWidthContainer) => {

    return (
        <div className="FixedWidthContainer"
             style={{
                 maxWidth: '1000px',
                 flexGrow: 1,
                 marginLeft: 'auto',
                 marginRight: 'auto'
             }}>
            {props.children}
        </div>
    );

});

export const NotesStory = () => {

    return (
        <FixedWidthContainer>
            <CKEditor5AppRoot>
                <NotesStoreProvider>
                    <BasicNotesDataSet>
                        <>
                            <CKEditor5NotesGlobalCSS/>
                            <NotesInner/>
                        </>
                    </BasicNotesDataSet>
                </NotesStoreProvider>
            </CKEditor5AppRoot>
        </FixedWidthContainer>
    );

}


import React from 'react';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import {deepMemo} from "../../../web/js/react/ReactUtils";
import {CKEditor5} from "./ckeditor5/CKEditor5";

// import '@ckeditor/ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css';

// sets up finder and context

interface NoteMenuProps {
    readonly anchorEl: HTMLElement;
}

const NoteMenu = React.memo((props: NoteMenuProps) => {
    return (
        <Menu
            id="fade-menu"
            keepMounted
            anchorEl={props.anchorEl}
            open={true}
            style={{height: '400px'}}>

            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
            <MenuItem>Option 3</MenuItem>
            <MenuItem>Option 4</MenuItem>
            <MenuItem>Option 5</MenuItem>
        </Menu>
    );
});

interface NoteEditorProps {
    readonly content: string;
}

type ActionMenuOnKeyPress = (event: React.KeyboardEvent) => void;
type ActionMenuTuple = [boolean, ActionMenuOnKeyPress];

function useActionMenu(): ActionMenuTuple {

    const [menuActive, setMenuActive] = React.useState(false);

    const onKeyPress = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {
            case '/':
                setMenuActive(true);
                break;
            case 'Escape':
            case ' ':
                setMenuActive(true);
                break;

        }

    }, []);

    return [menuActive, onKeyPress]

}

const NoteEditor = React.memo((props: NoteEditorProps) => {

    const [active, onKeyPress] = useActionMenu();

    return (
        <div onKeyPress={onKeyPress}>
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </div>
    );
});

interface INote {
    readonly id: string;
    readonly content: string
    readonly children?: ReadonlyArray<INote>;
}

const notes: ReadonlyArray<INote> = [
    {
        id: '101',
        content: 'first note',
    },
    {
        id: '102',
        content: 'this is the second note',
        children: [
            {
                id: '103',
                content: 'This is a child note'
            }
        ]
    }
]

interface NoteProps {
    readonly notes: ReadonlyArray<INote> | undefined;
}

const Notes = deepMemo((props: NoteProps) => {

    if ( ! props.notes) {
        return null;
    }

    return (
        <ul style={{flexGrow: 1}}>

            {props.notes.map((note) => (
                <li key={note.id}>
                    <NoteEditor content={note.content}/>
                    <Notes notes={note.children}/>
                </li>))}

        </ul>

    );

});

export const NotesStory = () => {

    return (
        <>
            <Notes notes={notes}/>

        </>
    );

    // return (
    //     <ul>
    //
    //         {notes.map((note) => (
    //             <li key={note.id}>
    //                 <Editor content={note.content}
    //                         onChange={NULL_FUNCTION}/>
    //             </li>))}
    //
    //     </ul>
    //
    // );

}


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

// import '@ckeditor/ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css';

// sets up finder and context

interface NoteMenuProps {
    readonly top: number;
    readonly left: number;

}

const NoteMenu = React.memo((props: NoteMenuProps) => {
    return (

        <Popover open={true}
                 anchorReference="anchorPosition"
                 anchorPosition={{ top: props.top, left: props.left }}
                 anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                 }}
                 transformOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                 }}>

            <Paper elevation={3}>

                <MenuList>
                    <MenuItem>
                        <ListItemText primary="hello world"/>
                    </MenuItem>
                    <MenuItem>
                        <ListItemText primary="hello world"/>
                    </MenuItem>
                </MenuList>
            </Paper>

        </Popover>

    );
});

interface NoteEditorProps {
    readonly content: string;
}

interface IActiveMenuPosition {
    readonly top: number;
    readonly left: number;
}

type ActionMenuOnKeyPress = (event: React.KeyboardEvent) => void;
type ActionMenuTuple = [IActiveMenuPosition | undefined, ActionMenuOnKeyPress];

function useActionMenu(): ActionMenuTuple {

    const [position, setPosition] = React.useState<IActiveMenuPosition | undefined>(undefined);

    const onKeyPress = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {
            case '/':

                if (window.getSelection()?.rangeCount === 1) {

                    const bcr = window.getSelection()!.getRangeAt(0).getBoundingClientRect();

                    setPosition({
                        top: bcr.bottom,
                        left: bcr.left,
                    });

                }

                break;
            case 'Escape':
            case ' ':
                setPosition(undefined);
                break;

        }

    }, []);

    return [position, onKeyPress]

}

const NoteEditor = React.memo((props: NoteEditorProps) => {

    const [position, onKeyPress] = useActionMenu();

    return (
        <div onKeyPress={onKeyPress}>
            {position && <NoteMenu {...position}/>}
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


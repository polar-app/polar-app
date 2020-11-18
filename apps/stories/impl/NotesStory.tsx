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

// import '@ckeditor/ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css';

// sets up finder and context

interface NoteMenuProps {
    readonly top: number;
    readonly left: number;

}

export const [NoteMenuSelectedStoreProvider, useNoteMenuSelectedStore, useNoteMenuSelectedListener] =
    createRXJSStore<string | undefined>();

const NoteMenu = React.memo((props: NoteMenuProps) => {

    const selectedMenuItem = useNoteMenuSelectedListener();
    const setSelectedMenuItem = useNoteMenuSelectedStore();

    interface NoteMenuItemProps {
        readonly text: string;
    }

    const NoteMenuItem = React.useCallback((props: NoteMenuItemProps) => {

        const id = props.text.toLowerCase().replace(/ /g, '-');

        return (
            <MenuItem onClick={() => setSelectedMenuItem(id)}
                      selected={selectedMenuItem === id}>
                <ListItemText primary={props.text} />
            </MenuItem>
        );
    }, [selectedMenuItem, setSelectedMenuItem]);

    return (

        <Paper elevation={3}
               style={{
                   position: 'absolute',
                   top: props.top,
                   left: props.left
               }}>

            <MenuList>
                <NoteMenuItem text="Embed"/>
                <NoteMenuItem text="Tomorrow"/>
                <NoteMenuItem text="Today"/>
                <NoteMenuItem text="Yesterday"/>
            </MenuList>
        </Paper>

    );
});

interface NoteEditorProps {
    readonly content: string;
}

interface IActiveMenuPosition {
    readonly top: number;
    readonly left: number;
}

type ActionMenuOnKeyDown = (event: React.KeyboardEvent) => void;
type ActionMenuTuple = [IActiveMenuPosition | undefined, ActionMenuOnKeyDown];

function useActionMenu(): ActionMenuTuple {

    const [position, setPosition] = React.useState<IActiveMenuPosition | undefined>(undefined);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // TODO: filter the list input based on what the user has typed
        // TODO: up/down arrows to select the right item
        // TODO: click away listener so that if I select another item this will go away
        // TODO: we can do editing.view.focus()
        // TODO: we can call ref.focus() (on the element) to select the current items
        // and we can use that to navigate through them.
        // TODO: link to another node using completion with [[
        // TODO: link to tags too

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
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                setPosition(undefined);
                break;

        }

    }, []);

    return [position, onKeyDown]

}

const NoteEditor = React.memo((props: NoteEditorProps) => {

    const [position, onKeyDown] = useActionMenu();

    const onKeyPress = React.useCallback(() => {

    }, []);

    return (
        <div onKeyDown={onKeyDown}>
            {position && <NoteMenu {...position}/>}
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </div>
    );
});

export type NoteID = IDStr;

interface INote {
    readonly id: string;
    readonly content: string
    readonly items?: ReadonlyArray<NoteID>;
}

function identifierFactory() {
    return Hashcodes.createRandomID();
}

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

type NotesIndex = {[id: string]: INote};

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

interface NoteProps extends INote {

}

const Note = React.memo((props: NoteProps) => {

    const items = props.items || [];
    const children = items.map(current => notesIndex[current]);

    return (
        <>
            <NoteEditor content={props.content}/>
            <Notes notes={children}/>
        </>
    );
});

interface NotesProps {
    readonly notes: ReadonlyArray<INote> | undefined;
}

const Notes = deepMemo((props: NotesProps) => {

    if ( ! props.notes) {
        return null;
    }

    return (

        <ul style={{flexGrow: 1}}>

            {props.notes.map((note) => (
                <li style={{
                        listStyleType: 'disc'
                    }}
                    key={note.id}>
                    <Note {...note}/>
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

}


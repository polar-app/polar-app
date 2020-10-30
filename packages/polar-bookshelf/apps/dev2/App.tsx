import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// const ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon';


import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';
import {EditableContent} from "./EditableContent";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Editor} from "./Editor";
import Memory = WebAssembly.Memory;
import {deepMemo} from "../../web/js/react/ReactUtils";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

// import '@ckeditor/ckeditor5-theme-lark/theme/ckeditor5-editor-classic/classiceditor.css';

const IFrameContent = React.memo(() => {

    const content = `    
        <html>
        <body>

        <p>
            first para
        </p>

        <p>
            second para
        </p>

        </body>
        </html>
    `;

    return (
        <div>
            <iframe srcDoc={content}></iframe>
        </div>
    );
});


const tags = [
    "linux",
    "microsoft",
    "google"
]

// sets up finder and context

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
        <ul>

            {props.notes.map((note) => (
                <li key={note.id}>
                    <Editor content={note.content}
                            onChange={NULL_FUNCTION}/>
                     <Notes notes={note.children}/>
                </li>))}

        </ul>

    );

});

export const App = () => {

    return (
        <>
            <Notes notes={notes}/>

            <Menu
                id="fade-menu"
                keepMounted
                open={true}
                style={{height: '100px'}}>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
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


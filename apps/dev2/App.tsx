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

const Notes = (props: NoteProps) => {

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

}

export const App = () => {

    return (
        <Notes notes={notes}/>
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


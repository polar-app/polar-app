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

interface Note {
    readonly content: string
    readonly children?: ReadonlyArray<Note>;
}

const notes: ReadonlyArray<Note> = [
    {
        content: 'first note',
    },
    {
        content: 'this is the second note',
    }
]

export const App = () => {

    return (
        <ul>

            {notes.map((note, idx) => (
                <li key={idx}>
                    <Editor content={note.content}
                            onChange={NULL_FUNCTION}/>
                </li>))}

        </ul>

    );

}


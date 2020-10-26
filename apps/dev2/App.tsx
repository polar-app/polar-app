import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
// const ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';
import '@ckeditor/ckeditor5-theme-lark';

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


export const App = () => (
    <div>
        <CKEditor
            editor={ ClassicEditor }
            data="<p>Hello from CKEditor 5!</p>"
            onInit={ (editor: any) => {
                // You can store the "editor" and use when it is needed.
                console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ ( event: any, editor: any ) => {
                const data = editor.getData();
                console.log( { event, editor, data } );
            } }
            onBlur={ ( event: any, editor: any ) => {
                console.log( 'Blur.', editor );
            } }
            onFocus={ ( event: any, editor: any ) => {
                console.log( 'Focus.', editor );
            } }
        />
    </  div>
);

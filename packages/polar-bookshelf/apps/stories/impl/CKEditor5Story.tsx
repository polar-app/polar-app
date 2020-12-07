import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {ckeditor5, CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import Button from '@material-ui/core/Button';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";

export const CKEditor5Story = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        console.log("key down: ", event.key);

    }, []);

    const editorRef = React.useRef<ckeditor5.IEditor>()

    const onClick = React.useCallback(() => {

        if (editorRef.current === undefined) {
            console.log("no editor");
            return;
        }

        // https://stackoverflow.com/questions/16835365/set-cursor-to-specific-position-in-ckeditor

        const editor = editorRef.current;

        const doc = editor.model.document;

        // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-getRoot
        const root = doc.getRoot();

        editor.model.change((writer: any) => {
            // beginning
            // writer.setSelection(root, 0)
            // end
            writer.setSelection(root, 'end')
        });

        editor.editing.view.focus();

        console.log('FIXME: ', root);

        // editorRef.current.model.document.selection.


    }, [editorRef]);

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
        console.log("FIXME: got editor: ", editor);
        editorRef.current = editor;
    }, [])

    return (
        <div>

            {/*<h1>Balloon editor</h1>*/}
            <div onKeyDown={handleKeyDown}>

                <CKEditor5GlobalCss/>

                <CKEditor5BalloonEditor content='this is the content'
                                        onChange={NULL_FUNCTION}
                                        onEditor={handleEditor}/>


            </div>

            <Button variant="contained" onClick={onClick}>debug</Button>

            {/*<h1>Classic editor</h1>*/}
            {/*<div onKeyDown={handleKeyDown}>*/}
            {/*    <CKEditor5ClassicEditor content='this is the content' onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>*/}
            {/*</div>*/}
        </div>
    )
}
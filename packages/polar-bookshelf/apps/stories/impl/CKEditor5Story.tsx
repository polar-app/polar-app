import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import Button from '@material-ui/core/Button';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";

export const CKEditor5Story = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        console.log("key down: ", event.key);

    }, []);

    const editorRef = React.useRef<ckeditor5.IEditor>()

    const positionCursorWithinEditor = React.useCallback((editor: ckeditor5.IEditor, offset: number) => {

        const doc = editor.model.document;

        editor.model.change((writer) => {

            const root = doc.getRoot();

            const position = writer.createPositionFromPath(root, [0, offset]);

            const range = writer.createRange(position, position);

            // writer.setSelection(root, 1)
            writer.setSelection(range);

        });

    }, []);

    const onClick = React.useCallback(() => {

        const editor = editorRef.current!;

        positionCursorWithinEditor(editor, 15);

        editor.editing.view.focus();



        // setTimeout(() => {
        //
        //     const {prefix, suffix} = doEditorSplit(editor);
        //
        //     console.log("prefix: ", prefix);
        //     console.log("suffix: ", suffix);
        //
        // }, 2000);
        //

        // extractContents();


        //
        // console.log("FIXME: dom root: ", ;
        //
        // const node = editor.model.document.getRoot().getChild(0);
        // const foo = editor.editing.view.domConverter.mapViewToDom(node);
        //
        // console.log("node: ", node);
        //
        // console.log(foo);

        // const editorSplit = doEditorSplit(editorRef.current!);
        //
        // console.log("prefix: ", editorSplit.prefix)
        // console.log("suffix: ", editorSplit.suffix)
        //

    }, [positionCursorWithinEditor]);

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
        editorRef.current = editor;
    }, [])

    return (
        <div style={{flexGrow: 1}}>

            {/*<h1>Balloon editor</h1>*/}
            <div onKeyDown={handleKeyDown}>

                <CKEditor5GlobalCss/>

                <CKEditor5BalloonEditor content='this is the content and this is <b>bold</b> content'
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

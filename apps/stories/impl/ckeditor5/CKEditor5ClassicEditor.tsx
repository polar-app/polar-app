import * as React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CKEditor5GlobalCss} from "./CKEditor5GlobalCss";
import { ckeditor5 } from "./CKEditor5BalloonEditor";


interface IProps {
    readonly content: string;
    readonly onChange: (content: string) => void;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
}

export const CKEditor5ClassicEditor = deepMemo((props: IProps) => {
    return (
        <>
            <CKEditor5GlobalCss/>
            {/*<CKEditorContext context={ Context }>*/}

                <CKEditor
                    editor={ ClassicEditor }
                    data={props.content}
                    onInit={ (editor: any) => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                        props.onEditor(editor);
                    } }
                    onChange={ ( event: any, editor: any ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        props.onChange(data);
                    } }
                    onBlur={ ( event: any, editor: any ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event: any, editor: any ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
            {/*</CKEditorContext>*/}
        </>
    );
});

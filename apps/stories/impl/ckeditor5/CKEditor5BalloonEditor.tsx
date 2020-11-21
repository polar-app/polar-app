import * as React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CKEditor5GlobalCss} from "./CKEditor5GlobalCss";

export namespace ckeditor5 {

    export interface IView {
        readonly focus: () => void;
    }

    export interface IEditing {
        readonly view: IView;
    }

    export type SelectionPosition = any;

    export interface ISelection {
        readonly getFirstPosition: () => SelectionPosition;
    }

    export interface IDocument {

    }

    export interface IWriter {
        readonly insertText: (text: string, position: SelectionPosition) => void;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html#where-are-the-editorinserthtml-and-editorinserttext-methods-how-to-insert-some-content
    export interface IModel {
        readonly document: IDocument;
        readonly change: (writer: IWriter) => void;
    }

    export interface InsertTableCommand {
        readonly execute: () => void;
    }

    export interface ICommands {
        readonly get: (name: 'insertTable') => InsertTableCommand;
    }

    export interface IEditor {
        readonly editing: IEditing;
        readonly model: IModel;
        readonly commands: ICommands;
    }

}

interface IProps {
    readonly content: string;
    readonly onChange: (content: string) => void;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
}

export const CKEditor5BalloonEditor = deepMemo((props: IProps) => {
    return (
        <>
            <CKEditor5GlobalCss/>
            {/*<CKEditorContext context={ Context }>*/}

                <CKEditor
                    editor={ BalloonEditor }
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

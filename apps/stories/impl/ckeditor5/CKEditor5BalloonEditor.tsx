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


    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_position-Position.html
    export interface ISelectionPosition {

        /**
         * Position offset converted to an index in position's parent node. It
         * is equal to the index of a node after this position. If position is
         * placed in text node, position index is equal to the index of that
         * text node.
         */
        readonly index: number;

        /**
         * Offset at which this position is located in its parent. It is equal
         * to the last item in position path.
         */
        readonly offset: number;

        /**
         * Is true if position is at the beginning of its parent, false otherwise.
         */
        readonly isAtStart: boolean;

        /**
         * Is true if position is at the end of its parent, false otherwise.
         */
        readonly isAtEnd: boolean;

        /**
         *  Returns text node instance in which this position is placed or null
         *  if this position is not in a text node.
         */
        readonly textNode: Text | null;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html
    export interface ISelection {
        readonly getFirstPosition: () => ISelectionPosition | null;
        readonly getLastPosition: () => ISelectionPosition | null;
        readonly sourceElement: HTMLElement;
    }

    export interface IDocument {
        readonly selection: ISelection;
    }

    export interface IWriter {
        readonly insertText: (text: string, position: ISelectionPosition) => void;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html#where-are-the-editorinserthtml-and-editorinserttext-methods-how-to-insert-some-content
    export interface IModel {
        readonly document: IDocument;
        readonly change: (writer: IWriter) => void;
    }

    export interface InsertTableCommand {
        readonly execute: () => void;
    }

    export interface IInsertLinkCommandOpts {
        readonly linkIsExternal: boolean;
    }

    export interface InsertLinkCommand {
        readonly execute: (link: string, opts?: IInsertLinkCommandOpts) => void;
    }

    export interface ICommands {

        get(name: 'insertTable'): InsertTableCommand;
        get(name: 'link'): InsertLinkCommand;

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
                    onInit={ (editor: ckeditor5.IEditor) => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                        props.onEditor(editor);
                    } }
                    onChange={ ( event: any, editor: any ) => {
                        const data = editor.getData();
                        console.log( { event, editor, data } );
                        props.onChange(data);
                    } }
                    onBlur={ ( event: any, editor: ckeditor5.IEditor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event: any, editor: ckeditor5.IEditor ) => {
                        console.log( 'Focus: selection: ', editor.model.document.selection );
                    } }
                />
            {/*</CKEditorContext>*/}
        </>
    );
});

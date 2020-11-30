import * as React from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
// import {ClassicEditor} from "@ckeditor/ckeditor5-build-classic";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
// import {InlineEditor} from "@ckeditor/ckeditor5-build-classic";

import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {CKEditor5GlobalCss} from "./CKEditor5GlobalCss";
import {MarkdownToHTML} from "../../../../../polar-app-public/polar-markdown-parser/src/MarkdownToHTML";
import markdown2html = MarkdownToHTML.markdown2html;
import {HTMLStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {HTMLToMarkdown} from "../../../../../polar-app-public/polar-markdown-parser/src/HTMLToMarkdown";
import html2markdown = HTMLToMarkdown.html2markdown;
import {useLifecycleTracer} from "../../../../web/js/hooks/ReactHooks";

export namespace ckeditor5 {

    export interface IView {
        readonly focus: () => void;
        readonly document: IDocument;
    }

    export interface IEditing {
        readonly view: IView;
    }


    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_position-Position.html
    export interface IPosition {

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

        /**
         * Node directly before this position or null if this position is in text node.
         */
        readonly nodeBefore: Node | null;

        /**
         * Node directly after this position or null if this position is in text node.
         */
        readonly nodeAfter: Node | null;

        /**
         * Parent element of this position.
         *
         * Keep in mind that parent value is calculated when the property is
         * accessed. If position path leads to a non-existing element, parent
         * property will throw error.
         *
         * Also it is a good idea to cache parent property if it is used
         * frequently in an algorithm (i.e. in a long loop).
         */
        readonly parent: Element | DocumentFragment;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html
    export interface ISelection {
        readonly getFirstPosition: () => IPosition | null;
        readonly getLastPosition: () => IPosition | null;
        readonly getFirstRange: () => Range | null;
        readonly sourceElement: HTMLElement;
    }

    export interface IKeyPressEvent {
        readonly domEvent: KeyboardEvent;
    }

    export interface IEventData {
        readonly stop: () => void;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html
    export interface IDocument {
        readonly selection: ISelection;

        readonly on: (eventName: 'keydown', handler: (data: IEventData, event: IKeyPressEvent) => void) => void;

    }

    export interface IRange {

    }

    interface IInsertTextAttributes {
        readonly bold?: boolean;
        readonly linkHref?: string;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_writer-Writer.html
    export interface IWriter {

        /**
         * Shortcut for Model#createRange().
         */
        readonly createRange: (start: IPosition, end?: IPosition) => IRange;
        readonly insertText: (text: string, attributes: IInsertTextAttributes, position: IPosition) => void;
        readonly remove: (itemOrRange: IRange) => void;
    }

    // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/faq.html#where-are-the-editorinserthtml-and-editorinserttext-methods-how-to-insert-some-content
    export interface IModel {

        /**
         * Creates a range spanning from the start position to the end position.
         */
        readonly createRange: (start: IPosition, end?: IPosition) => IRange;
        readonly document: IDocument;
        readonly change: (writerHandler: (writer: IWriter) => void) => void;
        readonly createPositionBefore: (itemOrPosition: IPosition) => IPosition;
        readonly createPositionAfter: (itemOrPosition: IPosition) => IPosition;
        readonly createPositionAt: (itemOrPosition: IPosition, offset?: number | 'end' | 'before' | 'after') => IPosition;
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
    readonly content: MarkdownStr;
    readonly onChange: (content: MarkdownStr) => void;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
    readonly noToolbar?: boolean;
}

export const CKEditor5BalloonEditor = React.memo(function CKEditor5BalloonEditor(props: IProps) {

    useLifecycleTracer('CKEditor5BalloonEditor');

    // we only need to convert to markdown on component startup.  This component
    // CAN NOT be reloaded during react re-renders so we have to give it the
    // content once and then have it do callbacks.

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const content = React.useMemo<HTMLStr>(() => markdown2html(props.content), []);

    console.log("FIXME: rendering");

    return (
        <>
            {/*<CKEditorContext context={ Context }>*/}

                <CKEditor
                    editor={ BalloonEditor }
                    config={{
                        // removePlugins: ['toolbar', 'ImageToolbar', 'TableToolbar'],
                        // toolbar: []
                    }}
                    data={content}
                    onReady={ (editor: ckeditor5.IEditor) => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                        props.onEditor(editor);

                        // (editor as any).keystrokes.set( 'Enter', ( data: any, stop: any ) => {
                        //     console.log( data );
                        //     stop(); // Works like data.preventDefault() + evt.stop()
                        // });

                    } }
                    onChange={ ( event: any, editor: any ) => {
                        const data = editor.getData();

                        // WARN: do not use a hook for this because ckeditor
                        // won't properly invoke it.

                        props.onChange(html2markdown(data));

                    } }
                    onBlur={ ( event: any, editor: ckeditor5.IEditor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event: any, editor: ckeditor5.IEditor ) => {
                        // console.log( 'Focus: selection: ', editor.model.document.selection );
                    } }
                />
            {/*</CKEditorContext>*/}
        </>
    );
});

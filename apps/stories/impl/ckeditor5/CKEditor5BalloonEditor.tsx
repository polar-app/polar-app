import * as React from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import {HTMLStr} from "polar-shared/src/util/Strings";
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

    interface IRootElement {

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html
    export interface IDocument {
        readonly selection: ISelection;

        readonly on: (eventName: 'keydown' | 'enter' | 'click', handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;
        readonly off: (eventName: 'keydown' | 'enter' | 'click', handler: (eventData: IEventData, event: IKeyPressEvent) => void) => void;

        readonly getRoot: () => IRootElement;
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

        readonly setSelection: (root: IRootElement, position: number | 'before' | 'after' | 'end' | 'on' | 'in') => void;

    }

    // https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_model-Model.html
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

/**
 * A data-format specific string like Markdown or HTML or JSON but that can be
 * converted to HTML
 */
export type DataStr = string;

export interface ContentEscaper {

    readonly escape: (input: DataStr) => HTMLStr;
    readonly unescape: (html: HTMLStr) => DataStr;

}

interface IProps {
    readonly content: DataStr;
    readonly onChange: (content: DataStr) => void;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
    readonly escaper?: ContentEscaper;
    readonly noToolbar?: boolean;
    readonly preEscaped?: boolean
}

/**
 * NOOP/null content escaper pattern.
 */
export const DefaultContentEscaper: ContentEscaper = {
    escape: input => input,
    unescape: html => html
}

// Current plugins:
//
//     "Base64UploadAdapter",
//     "Essentials",
//     "Autoformat",
//     "Bold",
//     "Underline",
//     "Italic",
//     "Strikethrough",
//     "Subscript",
//     "Superscript",
//     "BlockQuote",
//     "CKFinder",
//     "Heading",
//     "Image",
//     "ImageCaption",
//     "ImageStyle",
//     "ImageToolbar",
//     "ImageUpload",
//     "ImageResize",
//     "Link",
//     "MediaEmbed",
//     "Paragraph",
//     "PasteFromOffice",
//     "Table",
//     "TableToolbar",
//     "TableProperties",
//     "TableCellProperties",
//     "TextTransformation"


// NOTES:
//
// - if I literally have NO plugins then it's pretty fast.
//
// - with ALL the plugins removed, 50 items are about 2s - which is still too slow.

export const CKEditor5BalloonEditor = React.memo(function CKEditor5BalloonEditor(props: IProps) {

    // useLifecycleTracer('CKEditor5BalloonEditor');

    // we only need to convert to markdown on component startup.  This component
    // CAN NOT be reloaded during react re-renders so we have to give it the
    // content once and then have it do callbacks.

    const escaper = props.escaper || DefaultContentEscaper;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const content = React.useMemo<HTMLStr>(() => props.preEscaped ? props.content : escaper.escape(props.content), []);

    return (
        <>
            {/*<CKEditorContext context={ Context }>*/}

                <CKEditor
                    editor={ BalloonEditor }
                    config={{
                        // removePlugins: [
                        //     // "Base64UploadAdapter",
                        //     // "Essentials",
                        //     // "Autoformat",  /// important as it highlights elements.
                        //     //  "Bold",
                        //     // "Underline",
                        //     // "Italic",
                        //     // "Strikethrough",
                        //     // "Paragraph",     // REQUIRED
                        //     // "Subscript",
                        //     // "Superscript",
                        //     // "BlockQuote",
                        //     "CKFinder",  // DEF not required I think...
                        //     "Heading",   // DEF not required I think...
                        //     // "Image",
                        //     "ImageCaption",
                        //     "ImageStyle",
                        //     "ImageToolbar",
                        //     "ImageUpload",
                        //     "ImageResize",
                        //     // "Link",
                        //     "MediaEmbed",
                        //     "PasteFromOffice",
                        //     "Table",
                        //     "TableToolbar",
                        //     "TableProperties",
                        //     "TableCellProperties",
                        //     "TextTransformation"
                        // ],
                        removePlugins: [
                            "CKFinder",
                            "Heading",
                            // "ImageCaption",
                            // "ImageStyle",
                            // "ImageToolbar",
                            // "ImageUpload",
                            // "ImageResize",
                            "TextTransformation",
                            "MediaEmbed",
                            "PasteFromOffice",
                            "Table",
                            "TableToolbar",
                            "TableProperties",
                            "TableCellProperties",
                            "TextTransformation"
                        ],
                        toolbar: {
                            items: [
                                // 'heading',
                                // '|',
                                'bold',
                                'italic',
                                'blockQuote',
                                'underline',
                                'strikethrough',
                                'subscript',
                                'superscript',
                                'link',
                                '|',
                                // 'imageUpload',
                                // 'insertTable',
                                // 'mediaEmbed',
                                // 'specialcharacters'
                                // 'undo',
                                // 'redo'
                            ]
                        },
                        image: {
                            toolbar: [
                                // 'imageStyle:alignLeft',
                                // 'imageStyle:alignCenter',
                                // 'imageStyle:alignRight',
                                // 'imageStyle:full',
                                // 'imageStyle:side',
                                // '|',
                                'imageResize',
                                '|',
                                'imageTextAlternative'
                            ],
                            styles: [
                                // 'alignLeft',
                                // 'alignCenter',
                                // 'alignRight',
                                // 'full',
                                // 'side',
                                // {
                                // 	name: "alignLeft",
                                // 	isDefault: true
                                // },
                                // {
                                // 	name: "alignCenter",
                                // },
                                // {
                                // 	name: "alignRight",
                                // },
                                // {
                                // 	name: "full",
                                // },
                                // {
                                // 	name: "side",
                                // }

                            ]
                        },
                        table: {
                            contentToolbar: [
                                'tableColumn',
                                'tableRow',
                                'mergeTableCells',
                                'tableProperties',
                                'tableCellProperties'
                            ]
                        },
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

                        props.onChange(escaper.unescape(data));

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

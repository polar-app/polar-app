import * as React from "react";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import BalloonEditor from "@ckeditor/ckeditor5-build-balloon";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {useLifecycleTracer} from "../../../../web/js/hooks/ReactHooks";

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

    useLifecycleTracer('CKEditor5BalloonEditor');

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
                            // "Heading",
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
                                'heading',
                                '|',
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

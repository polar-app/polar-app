export namespace CKEditorConfigs {

    export const CONFIG0 = {
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
    };

    export const CONFIG1 = {
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
            // "Table",
            // "TableToolbar",
            // "TableProperties",
            // "TableCellProperties",
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
                'imageUpload',
                'insertTable',
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
    };

}
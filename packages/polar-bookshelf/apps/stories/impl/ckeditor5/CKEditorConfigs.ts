export namespace CKEditorConfigs {

    export const CONFIG0 = {
        removePlugins: [
            "CKFinder",
            "TextTransformation",
            "MediaEmbed",
            "PasteFromOffice",
            "Table",
            "TableToolbar",
            "TableProperties",
            "TableCellProperties",
            "TextTransformation",
            "ImageCaption",
            "ImageResize",

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
            ]
        },
        image: {
            toolbar: [
                // 'imageResize',
                // '|',
                // 'imageTextAlternative'
            ],
            styles: [
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

        removePlugins: [
            "CKFinder",
            // "Heading",
            // The ImageCaption plugin isn't really helpful and we can add text
            // ourselves
            "ImageCaption",
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

import {FormHandler} from './FormHandler';

const $ = require("jquery");

import 'bootstrap';
import 'bootstrap/js/src/util';
import 'bootstrap/js/src/modal';
import 'bootstrap/js/src/dropdown';
import 'bootstrap/js/src/tooltip';

// require('bootstrap/js/dist/modal.js');
// require('bootstrap/js/dist/dropdown.js');
// require('bootstrap/js/dist/tooltip.js');
// require('bootstrap/dist/css/bootstrap.css');
// require('font-awesome/css/font-awesome.css');
// require('summernote/dist/summernote.css');
require('summernote/dist/summernote-bs4');

import React, {Component} from "react";
import { render } from "react-dom";
import { JSONSchema6, JSONSchema6TypeName } from "json-schema";

import Form from "react-jsonschema-form";
//import SimpleMDE from 'react-simplemde-editor';

const {ReactSummernote} = require('react-summernote');

/**
 * Code to accept new input for flashcards, notes, comments, etc.
 */
class InputController {

    createNewFlashcard(targetElement: HTMLElement, formHandler: FormHandler) {

        const schema = {
            "title": "Flashcard",
            "description": "",
            "type": "object",
            // "required": [
            //     "front",
            //     "back"
            // ],
            "definitions": {
                "front": {
                    //"type": 'string',
                    "title": "Front"
                },
                // "back": {
                //     "type": "string",
                //     "title": "Back"
                // }
                // },
                // "age": {
                //     "type": "integer",
                //     "title": "Age"
                // },
                // "bio": {
                //     "type": "string",
                //     "title": "Bio"
                // },
                // "password": {
                //     "type": "string",
                //     "title": "Password",
                //     "minLength": 3
                // },
                // "telephone": {
                //     "type": "string",
                //     "title": "Telephone",
                //     "minLength": 10
                // }
            }
        };

        const uiSchema = {

            front: {
                "ui:widget": RichTextWidget,
            },
            back: {
                "ui:widget": RichTextWidget,
            }

        };

        // SimpleMDE.defaultProps = {
        //     options: {
        //         // enabling
        //         spellChecker: false,
        //         // setting to true re-downloads font awesome and it's much better
        //         // to have this as a dependency inline.
        //         autoDownloadFontAwesome: false,
        //         status: false,
        //         hideIcons: ["side-by-side", "fullscreen"],
        //         forceSync: true,
        //         extraKeys: {},
        //         //extraKeys['Tab'] = false,
        //         //extraKeys['Shift-Tab'] = false;
        //     },
        //     label: false
        //
        // };

        if(!targetElement) {
            throw new Error("No schemaFormElement");
        }

        let onChangeCallback = () => function(data: any) { formHandler.onChange(data) };
        let onSubmitCallback = () => function(data: any) { formHandler.onSubmit(data) };
        let onErrorCallback = () => function(data: any) { formHandler.onError(data) };

        render((
            <Form schema={schema}
                  autocomplete="off"
                  uiSchema={uiSchema}
                  onChange={onChangeCallback()}
                  onSubmit={onSubmitCallback()}
                  onError={onErrorCallback()} />
        ), targetElement);

    }

}

class RichTextEditor extends Component {


    constructor(props = {}) {
        super(props);
    }

    onChange(content: any) {
        console.log('this', this);
        console.log('onChange', content);
    }

    onImageUpload(images: any[], insertImage: Function) {

        console.log('onImageUpload', images);
        /* FileList does not support ordinary array methods */
        for (let i = 0; i < images.length; i++) {
            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(images[i]);
        }

    };

    render() {

        // https://github.com/summernote/react-summernote/issues/38
        //

        return (
            <ReactSummernote
                value=""
                options={{
                    lang: 'en-US',
                    height: 150,
                    dialogsInBody: true,
                    // toolbar: [
                    //     ['style', ['style']],
                    //     ['font', ['bold', 'underline', 'clear']],
                    //     ['fontname', ['fontname']],
                    //     ['para', ['ul', 'ol', 'paragraph']],
                    //     ['table', ['table']],
                    //     ['insert', ['link', 'picture', 'video']],
                    //     ['view', ['fullscreen', 'codeview']]
                    // ]
                }}
                onChange={this.onChange}
                onImageUpload={this.onImageUpload}
            />
        );
    }
}

function RichTextWidget(props: any) {

    const {id, classNames, label, help, required, description, errors, children} = props;

    let onImageUpload = (images: any[], insertImage: Function) => {

        console.log('onImageUpload', images);
        /* FileList does not support ordinary array methods */
        for (let i = 0; i < images.length; i++) {
            /* Stores as bas64enc string in the text.
             * Should potentially be stored separately and include just the url
             */
            const reader = new FileReader();

            reader.onloadend = () => {
                insertImage(reader.result);
            };

            reader.readAsDataURL(images[i]);
        }

    };

    return (
        <ReactSummernote
            value=""
            options={{
                lang: 'en-US',
                height: 150,
                dialogsInBody: true,
                // toolbar: [
                //     ['style', ['style']],
                //     ['font', ['bold', 'underline', 'clear']],
                //     ['fontname', ['fontname']],
                //     ['para', ['ul', 'ol', 'paragraph']],
                //     ['table', ['table']],
                //     ['insert', ['link', 'picture', 'video']],
                //     ['view', ['fullscreen', 'codeview']]
                // ]
            }}
            onChange={(newValue: any) => props.onChange(newValue)}
            // onChange={this.onChange}
            onImageUpload={onImageUpload}
        />
    );

}
//
// function MarkdownWidget(props: any) {
//
//     const {id, classNames, label, help, required, description, errors, children} = props;
//
//     let result = (
//         <div className="simplemde-control" data-required={required} data-textarea-id={id}>
//             <div className={classNames}>
//                 {description}
//                 {children}
//                 {errors}
//                 {help}
//                 <SimpleMDE onChange={(newValue: any) => props.onChange(newValue)} label="" id={id}/>
//             </div>
//         </div>
//     );
//
//     return result;
//
// }

module.exports.InputController = InputController;

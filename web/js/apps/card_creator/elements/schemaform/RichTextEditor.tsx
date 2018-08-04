// const React = require("react");
const ReactSummernote = require('react-summernote');
import React, { Component } from 'react';
//import ReactSummernote from 'summernote-react';

//import {ReactSummernote} from 'react-summernote';

export class RichTextEditor extends React.Component {

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

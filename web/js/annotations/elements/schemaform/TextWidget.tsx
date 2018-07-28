/**
 * This is our main widget for handling text fields which are HTML.
 */
import ReactSummernote from './ReactSummernote';
import React from 'react';
import {Logger} from '../../../logger/Logger';
const log = Logger.create();

export class TextWidget extends React.Component  {

    private readonly onChangeCallback: OnChangeCallback;

    constructor(props: any = {}) {
        super(props);
        this.onChangeCallback = props.onChange;

        this.onChange = this.onChange.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);

        console.log("FIXME: this.onChangeCallbac: " + this.onChangeCallback)
    }

    onChange(newValue: any) {
        console.log('FIXME: this: ', this);
        console.log('FIXME: this.onChangeCallback: ', this.onChangeCallback);
        console.log('onChange: newValue: ', newValue);

        log.debug('onChange', newValue);

        //this.onChangeCallback("");

    }

    /**
     * This is a workaround documented here:
     *
     * https://github.com/summernote/react-summernote/issues/38
     */
    onImageUpload(images: any[], insertImage: Function) {

        log.debug('onImageUpload', images);
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
                //onSubmit={this.onSubmit}
                onImageUpload={this.onImageUpload}
            />
        );
    }

}

interface OnChangeCallback {
    (newValue: string): void;
}

/**
 * This is our main widget for handling text fields which are HTML.
 */
import ReactSummernote from './ReactSummernote';
import React from 'react';

export class TextWidget extends React.Component  {

    constructor(props = {}) {
        super(props);
    }

    onChange(content: any) {
        console.log('this', this);
        console.log('onChange', content);
    }

    /**
     * This is a workaround documented here:
     *
     * https://github.com/summernote/react-summernote/issues/38
     */
    onImageUpload(images: any[], insertImage: Function) {

        console.log("FIXME: handling custom onImageUpload")

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

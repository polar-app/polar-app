const React = require("react");
const ReactSummernote = require('react-summernote');

export function RichTextWidget(props: any) {

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

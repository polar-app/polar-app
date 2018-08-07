
import React, { Component } from 'react';

export class TextareaEditorComponent extends Component {

    constructor(props = {}) {
        super(props);
    }

    onChange(content: any) {
        console.log('this', this);
        console.log('onChange', content);
    }

    render() {

        // https://github.com/summernote/react-summernote/issues/38

        return (
            <textarea>TextareaEditorComponent</textarea>
        );

    }

}

//const {JSONSchemaForm}  = require("react-jsonschema-form");

import {React, Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";
import SimpleMDE from 'react-simplemde-editor';

import {ImagePasteHandler} from "../../web/js/paste/ImagePasteHandler";

const schema = {
    "title": "Flashcard",
    "description": "",
    "type": "object",
    "required": [
        "front",
        "back"
    ],
    "properties": {
        "front": {
            "type": "string",
            "title": "Front"
        },
        "back": {
            "type": "string",
            "title": "Back"
        }
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

// spellChecker: true,
//     hideIcons: ["side-by-side", "fullscreen"]



class MySimpleMDE extends SimpleMDE {

    constructor() {

        super();
        //console.log("The constructor finished");
        console.log("FIXME00: ", this);
        console.log("FIXME01: ", Object.keys(this));

        // console.log(this.getMdeInstance)
        // console.log(this.getMdeInstance())

        //getMdeInstance().codemirror.options.extraKeys['Tab'] = false;
        //this.simplemde.codemirror.options.extraKeys['Shift-Tab'] = false;

    }

    render() {
        let result = super.render();
        console.log("FIXME10: ", result)
        console.log("FIXME11: ", this)
        console.log("FIXME12: ", Object.keys(this));
        return result;
    }
    //
    // createEditor() {
    //     console.log("FIXME: here");
    //
    //     super.createEditor();
    //     console.log("FIXME000", this.simplemde);
    //
    // }

}

const uiSchema = {
    front: {
        "ui:widget": MySimpleMDE,
        "ui:options": {
            label: false
        }
    },
    back: {
        "ui:widget": SimpleMDE,
        "ui:options": {
            label: false
        }
    }
};


// tab doesn't work properly in forms but it's also needed in markdown
//
// https://github.com/sparksuite/simplemde-markdown-editor/issues/122
SimpleMDE.defaultProps = {
    options: {
        status: false,
        hideIcons: ["side-by-side", "fullscreen"],
        extraKeys: {},
        //extraKeys['Tab'] = false,
        //extraKeys['Shift-Tab'] = false;
    },
    label: false

};

// SimpleMDE.defaultProps.options.extraKeys['Tab'] = false;
// SimpleMDE.defaultProps.options.extraKeys['Shift-Tab'] = false;

console.log(SimpleMDE);

//const log = (type) => console.log.bind(console, type);


function log() {

}

render((
       <Form schema={schema}
             uiSchema={uiSchema}
             onChange={log("changed")}
             onSubmit={log("submitted")}
             onError={log("errors")} />
), document.getElementById("schema-form"));

function pasteMutator(val) {
    return `[](${val})`;
}

new ImagePasteHandler(document.body, pasteMutator).start();

function pasteIt() {
    let element = document.createElement("div");
    element.innerHTML = `<pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-formatting cm-formatting-strong cm-strong">**</span><span class="cm-strong">this is a test</span><span class="cm-formatting cm-formatting-strong cm-strong">**</span></span></pre>`;
    document.execCommand("insertHTML", false, element.outerHTML);
}

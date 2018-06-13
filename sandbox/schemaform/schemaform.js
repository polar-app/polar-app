//const {JSONSchemaForm}  = require("react-jsonschema-form");

import React, { Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";
import SimpleMDE from 'react-simplemde-editor';


const schema = {
    "title": "A registration form",
    "description": "A simple form example.",
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


const uiSchema = {
    front: {
        "ui:widget": SimpleMDE,
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
}

SimpleMDE.defaultProps = {
    options: {
        hideIcons: ["side-by-side", "fullscreen"]
    }
};

const log = (type) => console.log.bind(console, type);

render((
       <Form schema={schema}
             uiSchema={uiSchema}
             onChange={log("changed")}
             onSubmit={log("submitted")}
             onError={log("errors")} />
), document.getElementById("app"));





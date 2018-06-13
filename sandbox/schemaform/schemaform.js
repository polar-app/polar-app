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
        "firstName",
        "lastName"
    ],
    "properties": {
        "firstName": {
            "type": "string",
            "title": "First name"
        },
        "lastName": {
            "type": "string",
            "title": "Last name"
        },
        "age": {
            "type": "integer",
            "title": "Age"
        },
        "bio": {
            "type": "string",
            "title": "Bio"
        },
        "password": {
            "type": "string",
            "title": "Password",
            "minLength": 3
        },
        "telephone": {
            "type": "string",
            "title": "Telephone",
            "minLength": 10
        }
    }
};

const uiSchema = {
    firstName: {
        "ui:widget": SimpleMDE
    }
}

const log = (type) => console.log.bind(console, type);

render((
       <Form schema={schema}
             uiSchema={uiSchema}
             onChange={log("changed")}
             onSubmit={log("submitted")}
             onError={log("errors")} />
), document.getElementById("app"));





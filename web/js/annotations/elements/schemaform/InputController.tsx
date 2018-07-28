import {FormHandler} from '../../FormHandler';

declare var global: any;
global.$ = global.jQuery = require("jquery");

import 'bootstrap/dist/js/bootstrap.bundle.js';

//const React = require("react");
import React from 'react' // FIXME: th8is might be part of the problem.. I can't
// import REact
import { render } from "react-dom";
import { JSONSchema6 } from "json-schema";
import Form from "react-jsonschema-form";
import {RichTextWidget} from "./RichTextWidget";
import {RichTextEditor} from './RichTextEditor';
import {TextareaWidget} from './TextareaWidget';

require('summernote/dist/summernote-bs4');
const {SchemaFactory} = require("./SchemaFactory");

if( ! React) {
    console.warn("FIXME: react: ", React);
    throw new Error("React is null!");
}

/**
 * Code to accept new input for flashcards, notes, comments, etc.
 */
export class InputController {

    createNewFlashcard(targetElement: HTMLElement, formHandler: FormHandler) {

        let schema: JSONSchema6 = SchemaFactory.create();

        if(!targetElement) {
            throw new Error("No schemaFormElement");
        }

        if(!schema) {
            throw new Error("No schema");
        }

        if(!formHandler) {
            throw new Error("No formHandler");
        }

        const uiSchema = {

            front: {
                "ui:widget": TextareaWidget,
            },
            // back: {
            //     "ui:widget": RichTextWidget,
            // }

        };

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

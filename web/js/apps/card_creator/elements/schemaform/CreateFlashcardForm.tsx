import {FormHandler} from './FormHandler';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import React from 'react'
import {render} from 'react-dom';
import {JSONSchema6} from 'json-schema';
import Form from 'react-jsonschema-form';
import {SchemaUIFactory} from './SchemaUIFactory';
import {SchemaFactory} from './SchemaFactory';

declare var global: any;
global.$ = global.jQuery = require("jquery");

require('summernote/dist/summernote-bs4');

/**
 * Code to accept new input for flashcards, notes, comments, etc.
 */
export class CreateFlashcardForm {

    /**
     * The FormHandler we're going to use.  We have to change it when we get
     * a new create flashcard request.
     */
    public formHandler: FormHandler = new FormHandler();

    private readonly targetElement: HTMLElement;

    constructor(targetElement: HTMLElement) {

        this.targetElement = targetElement;

        this.render();

    }

    render() {

        let schema: JSONSchema6 = SchemaFactory.create();
        let schemaUI = SchemaUIFactory.create();

        if(!this.targetElement) {
            throw new Error("No schemaFormElement");
        }

        if(!schema) {
            throw new Error("No schema");
        }

        let onChangeCallback = () => (data: any) => { return this.formHandler.onChange(data) };
        let onSubmitCallback = () => (data: any) => { return this.formHandler.onSubmit(data) };
        let onErrorCallback = () => (data: any) => { return this.formHandler.onError(data) };

        let form = <Form schema={schema}
                         autocomplete="off"
                         uiSchema={schemaUI}
                         showErrorList={false}
                         onChange={onChangeCallback()}
                         onSubmit={onSubmitCallback()}
                         onError={onErrorCallback()} />;

        render((form), this.targetElement);

    }

}

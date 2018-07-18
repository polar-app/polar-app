const $ = require("jquery");

import React, {Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";
import SimpleMDE from 'react-simplemde-editor';

const {ipcRenderer} = require('electron');
const {InputController} = require("../../../web/js/annotations/InputController");
const {FormHandler} = require("../../../web/js/annotations/FormHandler");
const {AnnotationType} = require("../../../web/js/metadata/AnnotationType");
const {Objects} = require("../../../web/js/util/Objects");

/**
 * Convert the data to an external form. The uiSchema includes functions which
 * can't be serialized.
 *
 * @param data
 */
function dataToExternal(data) {

    let result = Object.assign({}, data);
    delete result.uiSchema;
    return result;

}

function _requestParams() {

    let url = new URL(window.location.href);

    return {
        context: JSON.parse(url.searchParams.get("context")),
    }

}

class PostMessageFormHandler extends FormHandler {

    constructor(context) {
        super();
        this.context = context;
    }

    onChange(data) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)}, "*");
    }


    onSubmit(data) {

        data = Objects.duplicate(data);

        // we have to include the docDescriptor for what we're working on so
        // that the recipient can decide if they want to act on this new data.
        data.context = this.context;

        // for now we (manually) support flashcards
        data.annotationType = AnnotationType.FLASHCARD;

        // the metadata for creating the flashcard type.  This should probably
        // move to the schema in the future.  The ID is really just so that
        // we can compile the schema properly.
        data.flashcard = {
            id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        };

        console.log("onSubmit: ", data);
        //window.postMessage({ type: "onSubmit", data: dataToExternal(data)}, "*");

        // send this to the main process which then broadcasts it to all the renderers.
        ipcRenderer.send('create-annotation', data);

        window.close();

    }


    onError(data) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)}, "*");
    }

}

$(document).ready(function() {

    let requestParams = _requestParams();

    let inputController = new InputController();

    let schemaFormElement = document.getElementById("schema-form");

    let postMessageFormHandler = new PostMessageFormHandler(requestParams.context);

    inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

    // if(!schemaFormElement) {
    //     throw new Error("No schemaFormElement");
    // }
    //
    // render((
    //     <Form schema={schema}
    //           autocomplete="off"
    //           uiSchema={uiSchema}
    //           onChange={log("changed")}
    //           onSubmit={log("submitted")}
    //           onError={log("errors")} />
    // ), schemaFormElement);
    //
    // // ok.. this is a bit of a hack but we need to do it to get required text
    // // input areas to work
    // //
    // document.querySelectorAll(".simplemde-control").forEach(function (controlElement) {
    //
    //     let required = controlElement.getAttribute("data-required");
    //     let textareaId = controlElement.getAttribute("data-textarea-id");
    //
    //     // FIXME: there are multiple elements here to work with..
    //     controlElement.querySelectorAll("#" + textareaId).forEach(function (textareaElement) {
    //         //textareaElement.setAttribute("style", "display: inline;  ");
    //         textareaElement.setAttribute("style", "display: inline; margin: 0; padding: 0; height: 0; resize: none; border: 1px solid transparent; position:absolute; top: 100px; ");
    //
    //         // FIXME: fuck it.. required doesn't work properly but I don't care..
    //         //textareaElement.setAttribute("required", required);
    //     });


});

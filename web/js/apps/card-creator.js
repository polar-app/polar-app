const $ = require("jquery");

import React, {Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";
import SimpleMDE from 'react-simplemde-editor';

const {ipcRenderer} = require('electron');
const {InputController} = require("../annotations/InputController");
const {FormHandler} = require("../annotations/FormHandler");

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

class PostMessageFormHandler extends FormHandler {

    onChange(data) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)}, "*");
    }


    onSubmit(data) {

        // FIXME: include the docMeta fingerprint we're editing.  Use a new
        // DocDescriptor object which for now just has a fingerprint.

        console.log("onSubmit: ", data);
        //window.postMessage({ type: "onSubmit", data: dataToExternal(data)}, "*");

        // send this to the main process which then broadcasts it to all the renderers.
        ipcRenderer.send('create-annotation', data);

    }


    onError(data) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)}, "*");
    }

}

$(document).ready(function() {

    let inputController = new InputController();

    let schemaFormElement = document.getElementById("schema-form");

    inputController.createNewFlashcard(schemaFormElement, new PostMessageFormHandler());

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

const $ = require("jquery");

import React, {Component } from "react";
import { render } from "react-dom";

import Form from "react-jsonschema-form";
import SimpleMDE from 'react-simplemde-editor';


const {InputController} = require("../../web/js/input/CreateFlashcardInputController");
const {FormHandler} = require("../../web/js/input/FormHandler");

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


const uiSchema = {

    front: {
        "ui:widget": MarkdownWidget,
    },
    back: {
        "ui:widget": MarkdownWidget,
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

// FIXME: see if I can get simplemde to attach to a textarea

// FIXME: required isn't being set on the SimpleMD and when it IS the problme is
// that we get:
//
// An invalid form control with name='' is not focusable.
//
// and then
//
// An invalid form control with name='root_front' is not focusable.
//
// if the name is set.
//
// the issue is that the <textarea> is display:none;

// We have to set it up like:
//
// <textarea id="root_front" style="display: inline; margin: 0; padding: 0; height: 0; width: 0; resize: none; border: none;" required=""

// FIXME: see if I can have custom event handlers to adjust the 'textarea' as
// we work with it.

function MarkdownWidget(props) {

    const {id, classNames, label, help, required, description, errors, children} = props;

    // FIXME: also onChange is not being sent..

    let result = (
        <div className="simplemde-control" data-required={required} data-textarea-id={id}>
            <div className={classNames}>
                {/*<textarea id="textarea-{id}"></textarea>*/}
                {/*<label htmlFor={id}>FIXME: {label}{required ? "*" : null}</label>*/}
                {description}
                {children}
                {errors}
                {help}
                <SimpleMDE onChange={(newValue) => props.onChange(newValue)} label="" id={id}/>
            </div>
        </div>
    )

    // let testElement = document.createElement("div");
    // testElement.innerText = 'asdf';
    //
    // let result = render(testElement);
    //
    // result.addEventListener("load", function () {
    //     console.log("FIXME: w eare loaded");
    // });

    console.log("FIXME:", result);

    return result;

}


// tab doesn't work properly in forms but it's also needed in markdown
//
// https://github.com/sparksuite/simplemde-markdown-editor/issues/122
SimpleMDE.defaultProps = {
    options: {
        status: false,
        hideIcons: ["side-by-side", "fullscreen"],
        forceSync: true,
        extraKeys: {},
        //extraKeys['Tab'] = false,
        //extraKeys['Shift-Tab'] = false;
    },
    label: false

};

console.log(SimpleMDE);

function log(data) {
    return function(data) {
        console.log("This is the data data: ", data)
    }
}

function pasteIt() {
    let element = document.createElement("div");
    element.innerHTML = `<pre class=" CodeMirror-line " role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span class="cm-formatting cm-formatting-strong cm-strong">**</span><span class="cm-strong">this is a test</span><span class="cm-formatting cm-formatting-strong cm-strong">**</span></span></pre>`;
    document.execCommand("insertHTML", false, element.outerHTML);
}

function pasteMutator(val) {
    return `[](${val})`;
}

function onSubmit(data) {
    console.log("FIXME: onSubmit", arguments);
}

class PostMessageFormHandler extends FormHandler {

    onChange(data) {
        window.postMessage({ type: "onChange", data}, "*");
        console.log("onChange: ", data);
    }


    onSubmit(data) {
        window.postMessage({ type: "onSubmit", data}, "*");
        console.log("onSubmit: ", data);
    }


    onError(data) {
        window.postMessage({ type: "onError", data}, "*");
        console.log("onError: ", data);
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

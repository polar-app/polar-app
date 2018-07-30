///const $ = require("jquery");

import {InputController} from '../../annotations/elements/schemaform/InputController';
import {FormHandler} from '../../annotations/FormHandler';
import $ from '../../ui/JQuery';
import {PostMessageFormHandler} from "../../annotations/flashcards/PostMessageFormHandler";

// FIXME: this is where we need to resume.
//
// - The doc window needs to send its window ID and then the client needs to keep
//   this ID so it can post a message BACK to the original.
//
// - we should have three types of IPC patterns:
//
//    - broadcaster: forward all IPC messages to all renderers
//
//    - Channel: 1:1 mapping between two windows to create a channel between
//      them using postMessage so that the renderers can just use web standards
//      to consume the messages.

export class Entry {

    async start() {

        return new Promise<void>( resolve => {
            $(document).ready(function () {

                console.log("Ready to create flash card!");

                let requestParams = _requestParams();

                let inputController = new InputController();

                let schemaFormElement = <HTMLElement>document.getElementById("schema-form");

                let postMessageFormHandler = new PostMessageFormHandler(requestParams.context);

                inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

                resolve();
            })
        });
    }

}

/**
 * Convert the data to an external form. The uiSchema includes functions which
 * can't be serialized.
 *
 * @param data
 */
function dataToExternal(data: any) {

    let result = Object.assign({}, data);
    delete result.uiSchema;
    return result;

}

function _requestParams(): any {

    let url = new URL(window.location.href);

    let contextJSON = url.searchParams.get("context");

    let result = {
        context: null
    };

    if (contextJSON) {
        result = {
            context: JSON.parse(contextJSON),
        }
    };

    return result;


}


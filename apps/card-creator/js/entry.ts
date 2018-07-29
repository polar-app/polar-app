///const $ = require("jquery");

import {ipcRenderer} from 'electron';
import {FormHandler} from '../../../web/js/annotations/FormHandler';
import {InputController} from '../../../web/js/annotations/elements/schemaform/InputController';

const {AnnotationType} = require("../../../web/js/metadata/AnnotationType");
const {Objects} = require("../../../web/js/util/Objects");

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

function _requestParams() {

    let url = new URL(window.location.href);

    let contextJSON = url.searchParams.get("context");

    if (contextJSON) {
        return {
            context: JSON.parse(contextJSON),
        }
    } else {
        throw new Error("No context");
    }

}

class PostMessageFormHandler extends FormHandler {

    private readonly context: any;

    constructor(context: any) {
        super();
        this.context = context;
    }

    onChange(data: any) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)}, "*");
    }


    onSubmit(data: any) {

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

        // don't close when we're the only window and in dev mode.
        // FIXME: window.close();

    }

    onError(data: any) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)}, "*");
    }

}

$(document).ready(function() {

    console.log("Ready to create flash card!");

    let requestParams = _requestParams();

    let inputController = new InputController();

    let schemaFormElement = <HTMLElement>document.getElementById("schema-form");

    let postMessageFormHandler = new PostMessageFormHandler(requestParams.context);

    inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

});


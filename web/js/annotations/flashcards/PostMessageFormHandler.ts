import {ipcRenderer} from 'electron';
import {FormHandler} from "../FormHandler";
import {AnnotationType} from "../../metadata/AnnotationType";
import {Logger} from "../../logger/Logger";
import {CreateFlashcardRequest} from '../../apps/card_creator/CreateFlashcardRequest';
import {CreateAnnotationRequest} from '../../flashcards/controller/CreateAnnotationRequest';

const log = Logger.create();

export class PostMessageFormHandler extends FormHandler {

    private readonly createFlashcardRequest: CreateFlashcardRequest;

    constructor(createFlashcardRequest: CreateFlashcardRequest) {
        super();
        this.createFlashcardRequest = createFlashcardRequest;
    }

    onChange(data: any) {
        console.log("onChange: ", data);
    }


    onSubmit(data: any) {

        console.log("onSubmit: ", data);

        // FIXME: refactor this to send a typed data structure.

        data = Object.assign({}, data);

        let createAnnotationRequest
            = new CreateAnnotationRequest(this.createFlashcardRequest.docDescriptor,
                                          AnnotationType.FLASHCARD,
                                          data);

        // FIXME: this is broken..
        // the metadata for creating the flashcard type.  This should probably
        // move to the schema in the future.  The ID is really just so that
        // we can compile the schema properly.
        data.flashcard = {
            id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        };

        // send this to the main process which then broadcasts it to all the
        // renderers
        ipcRenderer.send('create-annotation', data);
        log.info("Sent create-annotation message");

    }

    onError(data: any) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)},
        // "*");
    }

}


import {ipcRenderer} from 'electron';
import {FormHandler} from "../FormHandler";
import {AnnotationType} from "../../metadata/AnnotationType";
import {Logger} from "../../logger/Logger";

const log = Logger.create();

export class PostMessageFormHandler extends FormHandler {

    private readonly context: any;

    constructor(context: any) {
        super();
        this.context = context;
    }

    onChange(data: any) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)},
        // "*");
    }


    onSubmit(data: any) {

        data = Object.assign({}, data);

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
        //window.postMessage({ type: "onSubmit", data: dataToExternal(data)},
        // "*");

        // send this to the main process which then broadcasts it to all the
        // renderers
        ipcRenderer.send('create-annotation', data);
        log.info("Sent create-annotation message");

        // don't close when we're the only window and in dev mode.
        // FIXME: window.close();

    }

    onError(data: any) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)},
        // "*");
    }

}


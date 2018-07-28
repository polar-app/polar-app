import {CardCreatorWebComponent} from '../elements/CardCreatorWebComponent';
import {Dialog} from '../../ui/dialog/Dialog';
import Point = Electron.Point;
const {InputController} = require("../elements/schemaform/InputController");
const {FormHandler} = require("../FormHandler");

export class AnnotationsController {

    /**
     * Create a new flashcard.
     */
    createFlashcard(context: any, pageNum: number, pageOffset: Point) {

        let id = "create-flashcard";
        let createFlashcardDialog = document.getElementById(id);

        if(! createFlashcardDialog) {

            createFlashcardDialog = document.createElement("div");
            createFlashcardDialog.setAttribute("id", id);
            createFlashcardDialog.style.backgroundColor = `#FFF`;
            createFlashcardDialog.style.zIndex = `999`;

            document.body.appendChild(createFlashcardDialog);

            //now insert the card creator HTML content into it...

            // let cardCreatorLink = document.querySelector("#card-creator-link");
            //
            // let template = cardCreatorLink.import.querySelector('template');
            // let clone = document.importNode(template.content, true);

            // FIXME: create a shadow root in the flashcard ...

            let shadowRoot = createFlashcardDialog.attachShadow({mode: 'open'});

            //shadowRoot.appendChild(clone);

            let cardCreatorElement = document.createElement("card-creator");
            shadowRoot.appendChild(cardCreatorElement);

            console.log("Created it!")

        }

        let dialog = new Dialog(createFlashcardDialog);
        dialog.width = 800;
        dialog.height = 800;
        dialog.show();

        let inputController = new InputController();

        let schemaFormElement = document.getElementById("schema-form");

        let postMessageFormHandler = new PostMessageFormHandler();

        inputController.createNewFlashcard(schemaFormElement, postMessageFormHandler);

    }

    start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);
        CardCreatorWebComponent.register();
    }

    onMessageReceived(event: any) {

        // get the page number

        let data = event.data;
        let matchingSelectors = data.matchingSelectors;
        let matchingSelector = matchingSelectors[".page"];

        let pageNum: number = matchingSelector.annotationDescriptors[0].pageNumber;

        if(data && data.type === "create-flashcard") {
            this.createFlashcard(event.context, pageNum, data.points.pageOffset);
        }

    }

}



class PostMessageFormHandler extends FormHandler {

    onChange(data: any) {
        console.log("onChange: ", data);
        //window.postMessage({ type: "onChange", data: dataToExternal(data)}, "*");
    }

    onSubmit(data: any) {
        //
        // data = Objects.duplicate(data);
        //
        // // we have to include the docDescriptor for what we're working on so
        // // that the recipient can decide if they want to act on this new data.
        // data.context = this.context;
        //
        // // for now we (manually) support flashcards
        // data.annotationType = AnnotationType.FLASHCARD;
        //
        // // the metadata for creating the flashcard type.  This should probably
        // // move to the schema in the future.  The ID is really just so that
        // // we can compile the schema properly.
        // data.flashcard = {
        //     id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        // };
        //
        // console.log("onSubmit: ", data);
        // //window.postMessage({ type: "onSubmit", data: dataToExternal(data)}, "*");
        //
        // // send this to the main process which then broadcasts it to all the renderers.
        // ipcRenderer.send('create-annotation', data);
        //
        // // don't close when we're the only window and in dev mode.
        // // FIXME: window.close();

    }


    onError(data: any) {
        console.log("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)}, "*");
    }

}

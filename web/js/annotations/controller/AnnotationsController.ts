import {CardCreatorWebComponent} from '../elements/CardCreatorWebComponent';
import {Dialog} from '../../ui/dialog/Dialog';
import Point = Electron.Point;
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

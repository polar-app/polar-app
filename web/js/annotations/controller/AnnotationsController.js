"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CardCreatorWebComponent_1 = require("../elements/CardCreatorWebComponent");
const DocFormatFactory_1 = require("../../docformat/DocFormatFactory");
class AnnotationsController {
    /**
     * Create a new flashcard.
     */
    createFlashcard(context, pageNum, pageOffset) {
        let id = "create-flashcard";
        let createFlashcardDialog = document.getElementById(id);
        let docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
        if (!createFlashcardDialog) {
            let pageElement = docFormat.getPageElementFromPageNum(pageNum);
            // let boxRect = Rects.createFromBasicRect({
            //     left: pageElementPoint.x,
            //     top: pageElementPoint.y,
            //     width: 150,
            //     height: 150
            // });
            createFlashcardDialog = document.createElement("div");
            createFlashcardDialog.setAttribute("id", id);
            createFlashcardDialog.setAttribute("title", "Create Flashcard");
            createFlashcardDialog.style.display = "none";
            createFlashcardDialog.style.position = "absolute";
            createFlashcardDialog.style.left = `${pageOffset.x}px`;
            createFlashcardDialog.style.top = `${pageOffset.y}px`;
            createFlashcardDialog.style.width = `800px`;
            createFlashcardDialog.style.height = `800px`;
            createFlashcardDialog.style.zIndex = `999`;
            createFlashcardDialog.style.backgroundColor = `#FFF`;
            pageElement.insertBefore(createFlashcardDialog, pageElement.firstChild);
            //now insert the card creator HTML content into it...
            // let cardCreatorLink = document.querySelector("#card-creator-link");
            //
            // let template = cardCreatorLink.import.querySelector('template');
            // let clone = document.importNode(template.content, true);
            // FIXME: create a shadow root in the flashcard ...
            let shadowRoot = createFlashcardDialog.attachShadow({ mode: 'open' });
            //shadowRoot.appendChild(clone);
            let cardCreatorElement = document.createElement("card-creator");
            //shadowRoot.appendChild(cardCreatorElement);
            console.log("Created it!");
        }
        // $(createFlashcardDialog).show();
        createFlashcardDialog.style.display = 'block';
        //
        //
        // $( function() {
        //     $( createFlashcardDialog ).dialog({
        //         width: 800,
        //         height: 800
        //     });
        // } );
    }
    start() {
        window.addEventListener("message", event => this.onMessageReceived(event), false);
        CardCreatorWebComponent_1.CardCreatorWebComponent.register();
    }
    onMessageReceived(event) {
        console.log("FIXME: ", event);
        // get the page number
        let data = event.data;
        let matchingSelectors = data.matchingSelectors;
        let matchingSelector = matchingSelectors[".page"];
        let pageNum = matchingSelector.annotationDescriptors[0].pageNumber;
        if (data && data.type === "create-flashcard") {
            this.createFlashcard(event.context, pageNum, data.points.pageOffset);
        }
    }
}
exports.AnnotationsController = AnnotationsController;
//# sourceMappingURL=AnnotationsController.js.map
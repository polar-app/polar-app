"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CardCreatorWebComponent_1 = require("../elements/CardCreatorWebComponent");
var DocFormatFactory_1 = require("../../docformat/DocFormatFactory");
var AnnotationsController = /** @class */ (function () {
    function AnnotationsController() {
    }
    /**
     * Create a new flashcard.
     */
    AnnotationsController.prototype.createFlashcard = function (context, pageNum, pageOffset) {
        var id = "create-flashcard";
        var createFlashcardDialog = document.getElementById(id);
        var docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
        if (!createFlashcardDialog) {
            var pageElement = docFormat.getPageElementFromPageNum(pageNum);
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
            createFlashcardDialog.style.left = pageOffset.x + "px";
            createFlashcardDialog.style.top = pageOffset.y + "px";
            createFlashcardDialog.style.width = "800px";
            createFlashcardDialog.style.height = "800px";
            createFlashcardDialog.style.zIndex = "999";
            createFlashcardDialog.style.backgroundColor = "#FFF";
            pageElement.insertBefore(createFlashcardDialog, pageElement.firstChild);
            //now insert the card creator HTML content into it...
            // let cardCreatorLink = document.querySelector("#card-creator-link");
            //
            // let template = cardCreatorLink.import.querySelector('template');
            // let clone = document.importNode(template.content, true);
            // FIXME: create a shadow root in the flashcard ...
            var shadowRoot = createFlashcardDialog.attachShadow({ mode: 'open' });
            //shadowRoot.appendChild(clone);
            var cardCreatorElement = document.createElement("card-creator");
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
    };
    AnnotationsController.prototype.start = function () {
        var _this = this;
        window.addEventListener("message", function (event) { return _this.onMessageReceived(event); }, false);
        CardCreatorWebComponent_1.CardCreatorWebComponent.register();
    };
    AnnotationsController.prototype.onMessageReceived = function (event) {
        console.log("FIXME: ", event);
        // get the page number
        var data = event.data;
        var matchingSelectors = data.matchingSelectors;
        var matchingSelector = matchingSelectors[".page"];
        var pageNum = matchingSelector.annotationDescriptors[0].pageNumber;
        if (data && data.type === "create-flashcard") {
            this.createFlashcard(event.context, pageNum, data.points.pageOffset);
        }
    };
    return AnnotationsController;
}());
exports.AnnotationsController = AnnotationsController;
//# sourceMappingURL=AnnotationsController.js.map
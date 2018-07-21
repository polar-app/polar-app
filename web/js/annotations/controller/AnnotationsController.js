require("jquery-ui-bundle");

class AnnotationsController {

    /**
     * Create a new flashcard.
     */
    createFlashcard(context) {

        let id = "create-flashcard";
        let createFlashcardDialog = document.getElementById(id);

        if(! createFlashcardDialog) {

            createFlashcardDialog = document.createElement("div");
            createFlashcardDialog.setAttribute("id", id);
            createFlashcardDialog.setAttribute("title", "Create Flashcard");
            createFlashcardDialog.style.display = "none";
            document.body.appendChild(createFlashcardDialog);

            //now insert the card creator HTML content into it...

            let cardCreatorLink = document.querySelector("#card-creator-link");

            let template = cardCreatorLink.import.querySelector('template');
            let clone = document.importNode(template.content, true);

            // FIXME: create a shadow root in the flashcard ...

            let shadowRoot = createFlashcardDialog.attachShadow({mode: 'open'});

            shadowRoot.appendChild(clone);

        }

        $( function() {
            $( createFlashcardDialog ).dialog({
                width: 800,
                height: 800
            });
        } );

    }

    start() {

        window.addEventListener("message", event => this.onMessageReceived(event), false);

    }

    onMessageReceived(event) {

        if(event.data && event.data.type === "create-flashcard") {
            this.createFlashcard(event.context);
        }

    }

}

module.exports.AnnotationsController = AnnotationsController;

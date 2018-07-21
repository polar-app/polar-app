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

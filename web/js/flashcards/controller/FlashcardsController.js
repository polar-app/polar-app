const {ipcRenderer} = require('electron')
const {AnnotationType} = require("../../metadata/AnnotationType");

module.exports.FlashcardsController = class {

    constructor(model) {
        this.model = model;

        ipcRenderer.on('create-annotation', (event, data) => {

            console.log("Received create-annotation event: ", data);

            if(data.annotationType === AnnotationType.FLASHCARD) {
                console.log("Working with flashcard");
                if(data.context.docDescriptor === this.model.docMeta.docInfo.fingerprint) {
                    console.log("Going to add this flashcard to the model");
                    this.onCreateFlashcard(data);
                }

            }

            // I don't think we need to listen to these here but rather in the
            // specific controllers.

        });

    }

    /**
     * Called when we need to create a new flashcard.
     */
    onCreateFlashcard(data) {

        // FIXME: create testable code that takes the data and builds a flashcard
        // that we can add to the model.

        console.log("onCreateFlashcard: ", data);

    }

};

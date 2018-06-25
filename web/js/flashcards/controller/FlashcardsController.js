const {ipcRenderer} = require('electron')
const {AnnotationType} = require("../../metadata/AnnotationType");
const {Flashcards} = require("../../metadata/Flashcards");

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

        console.log("onCreateFlashcard: ", data);

        let flashcard = Flashcards.createFromSchemaFormData(data);

        // FIXME: now create update model with our new flashcard

        let textHighlightAnnotationDescriptors =
            data.context.matchingSelectors[".text-highlight"].annotationDescriptors;

        textHighlightAnnotationDescriptors.forEach(annotationDescriptor => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            let textHighlight = pageMeta.textHighlights[annotationDescriptor.textHighlightId];
            textHighlight.flashcards[flashcard.id] = flashcard;
        });
    }

};

const {ipcRenderer} = require('electron')
const {AnnotationType} = require("../../metadata/AnnotationType");
const {Flashcards} = require("../../metadata/Flashcards");

module.exports.FlashcardsController = class {

    constructor(model) {
        this.model = model;
    }

    start() {

        if(ipcRenderer) {

            console.log("IPC listener added for create-annotation")

            ipcRenderer.on('create-annotation', (event, data) => {

                console.log("Received create-annotation event: ", data);

                if(data.annotationType === AnnotationType.FLASHCARD) {

                    console.log("Working with flashcard");

                    if(data.context.docDescriptor.fingerprint === this.model.docMeta.docInfo.fingerprint) {

                        console.log("Going to add this flashcard to the model");
                        this.onCreateFlashcard(data);

                    } else {
                        console.log(`Ignoring flashcard.  ${data.context.docDescriptor.fingerprint} != ${this.model.docMeta.docInfo.fingerprint}`)
                    }

                }

                // I don't think we need to listen to these here but rather in the
                // specific controllers.

            });

        } else {
            console.warn("Not running within electron");
        }

    }

    /**
     * Called when we need to create a new flashcard.
     */
    onCreateFlashcard(data) {

        console.log("onCreateFlashcard: ", data);

        let flashcard = Flashcards.createFromSchemaFormData(data);

        let textHighlightAnnotationDescriptors =
            data.context.matchingSelectors[".text-highlight"].annotationDescriptors;

        // FIXME: if there are multiple visual annotations, each with the same ID
        // which is currently a bug, then we need to filter them out to just ONE
        // annotation.
        textHighlightAnnotationDescriptors.forEach(annotationDescriptor => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            let textHighlight = pageMeta.textHighlights[annotationDescriptor.textHighlightId];

            if(!textHighlight) {
                throw new Error(`No text highlight for ID ${annotationDescriptor.textHighlightId} on page ${annotationDescriptor.pageNum}`);
            }

            textHighlight.flashcards[flashcard.id] = flashcard;
        });
    }

};

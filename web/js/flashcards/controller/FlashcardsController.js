"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../logger/Logger");
const electron_1 = require("electron");
const Flashcards_1 = require("../../metadata/Flashcards");
const AnnotationType_1 = require("../../metadata/AnnotationType");
const log = Logger_1.Logger.create();
class FlashcardsController {
    constructor(model) {
        this.model = model;
    }
    start() {
        if (electron_1.ipcRenderer) {
            log.info("IPC listener added for create-annotation");
            electron_1.ipcRenderer.on('create-annotation', (event, data) => {
                log.info("Received create-annotation event: ", data);
                if (data.annotationType === AnnotationType_1.AnnotationType.FLASHCARD) {
                    log.info("Working with flashcard: ", data);
                    if (data.context.docDescriptor.fingerprint === this.model.docMeta.docInfo.fingerprint) {
                        log.info("Going to add this flashcard to the model");
                        this.onCreateFlashcard(data);
                    }
                    else {
                        log.info(`Ignoring flashcard.  ${data.context.docDescriptor.fingerprint} != ${this.model.docMeta.docInfo.fingerprint}`);
                    }
                }
            });
        }
        else {
            console.warn("Not running within electron");
        }
    }
    onCreateFlashcard(data) {
        log.info("onCreateFlashcard: ", data);
        let flashcard = Flashcards_1.Flashcards.createFromSchemaFormData(data);
        let textHighlightAnnotationDescriptors = data.context.matchingSelectors[".text-highlight"].annotationDescriptors;
        textHighlightAnnotationDescriptors.forEach((annotationDescriptor) => {
            let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
            let textHighlight = pageMeta.textHighlights[annotationDescriptor.id];
            if (!textHighlight) {
                throw new Error(`No text highlight for ID ${annotationDescriptor.id} on page ${annotationDescriptor.pageNum}`);
            }
            textHighlight.flashcards[flashcard.id] = flashcard;
        });
    }
}
exports.FlashcardsController = FlashcardsController;
//# sourceMappingURL=FlashcardsController.js.map
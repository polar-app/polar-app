import {Logger} from "../../logger/Logger";
import {Model} from '../../Model';
import {IPCEngines} from '../../ipc/handler/IPCEngines';
import {CreateAnnotationHandler} from './handlers/CreateAnnotationHandler';

const log = Logger.create();

/**
 * Runs in our main process and fires when a flashcard has been created and
 * needs to be stored in the model.
 *
 * @ElectronRendererContext
 */
export class FlashcardsController {

    private model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    start() {

        let ipcEngine = IPCEngines.renderer();

        ipcEngine.registry.registerPath('/api/annotations/create-annotation', new CreateAnnotationHandler(this.model));

        ipcEngine.start();


        // // TODO move this code to the AnnotationEvent system and test it
        // // along with form data.
        //
        // if(ipcRenderer) {
        //
        //     log.info("IPC listener added for create-annotation")
        //
        //     ipcRenderer.on('create-annotation', (event: any, data: any) => {
        //
        //         log.info("Received create-annotation event: ", data);
        //
        //         if(data.annotationType === AnnotationType.FLASHCARD) {
        //
        //             log.info("Working with flashcard: ", data);
        //
        //             if(data.context.docDescriptor.fingerprint === this.model.docMeta.docInfo.fingerprint) {
        //
        //                 log.info("Going to add this flashcard to the model");
        //                 this.onCreateFlashcard(data);
        //
        //             } else {
        //                 log.info(`Ignoring flashcard.  ${data.context.docDescriptor.fingerprint} != ${this.model.docMeta.docInfo.fingerprint}`)
        //             }
        //
        //         }
        //
        //         // I don't think we need to listen to these here but rather in the
        //         // specific controllers.
        //
        //     });
        //
        // } else {
        //     console.warn("Not running within electron");
        // }

    }

    /**
     * Called when we need to create a new flashcard.
     */
    onCreateFlashcard(data: any) {

        // log.info("onCreateFlashcard: ", data);
        //
        // let flashcard = Flashcards.createFromSchemaFormData(data);
        //
        // let textHighlightAnnotationDescriptors =
        //     data.context.matchingSelectors[".text-highlight"].annotationDescriptors;
        //
        // // FIXME: if there are multiple visual annotations, each with the same ID
        // // which is currently a bug, then we need to filter them out to just ONE
        // // annotation.
        // textHighlightAnnotationDescriptors.forEach((annotationDescriptor: AnnotationDescriptor) => {
        //     let pageMeta = this.model.docMeta.getPageMeta(annotationDescriptor.pageNum);
        //     let textHighlight = pageMeta.textHighlights[annotationDescriptor.id];
        //
        //     if(!textHighlight) {
        //         throw new Error(`No text highlight for ID ${annotationDescriptor.id} on page ${annotationDescriptor.pageNum}`);
        //     }
        //
        //     textHighlight.flashcards[flashcard.id] = flashcard;
        // });

    }

}

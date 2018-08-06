import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {AnnotationContainer} from '../../../metadata/AnnotationContainer';
import {Annotation} from '../../../metadata/Annotation';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {Logger} from '../../../logger/Logger';
import {AnnotationType} from '../../../metadata/AnnotationType';
import {Model} from '../../../Model';

const log = Logger.create();

/**
 * Called when the context menu told us to create a new flashcard.  Our job
 * is to reset the form first.
 */
export class CreateAnnotationHandler extends IPCHandler<AnnotationContainer<Annotation>> {

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    protected createValue(ipcMessage: IPCMessage<any>): AnnotationContainer<Annotation> {
        return new AnnotationContainer(ipcMessage.value);
    }

    protected async handleIPC(event: IPCEvent, annotationContainer: AnnotationContainer<Annotation>): Promise<any> {

        log.info("Got create annotation message: ", annotationContainer );

        let descriptor = annotationContainer.descriptor;

        if(descriptor.type === AnnotationType.FLASHCARD) {

            log.info("Working with flashcard: ", annotationContainer.value);

            if(descriptor.docFingerprint === this.model.docMeta.docInfo.fingerprint) {

                log.info("Going to add this flashcard to the model");
                //this.onCreateFlashcard(data);
                log.info("FIXME: we still need to write it to the store properly..")

                let pageMeta = this.model.docMeta.

                textHighlight.flashcards[flashcard.id] = flashcard;

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


            } else {
                log.info(`Ignoring flashcard.  ${descriptor.docFingerprint} != ${this.model.docMeta.docInfo.fingerprint}`)
            }

        }

        return undefined;

    }

}

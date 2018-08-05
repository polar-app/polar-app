import {ipcRenderer} from 'electron';
import {SchemaFormFlashcardConverter} from './SchemaFormFlashcardConverter';
import {FormHandler} from '../elements/schemaform/FormHandler';
import {AnnotationContainer} from '../../../metadata/AnnotationContainer';
import {AnnotationDescriptor} from '../../../metadata/AnnotationDescriptor';
import {Logger} from '../../../logger/Logger';
import {AnnotationType} from '../../../metadata/AnnotationType';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';
import {WritablePipe} from '../../../ipc/pipes/Pipe';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {IPCResponse} from '../../../ipc/handler/IPCResponse';

const log = Logger.create();

export class PostMessageFormHandler extends FormHandler {

    private readonly annotationDescriptor: AnnotationDescriptor;

    private readonly response: IPCResponse;

    constructor(annotationDescriptor: AnnotationDescriptor, response: IPCResponse) {
        super();
        this.annotationDescriptor = annotationDescriptor;
        this.response = response;
    }

    onChange(data: any) {
        log.info("onChange: ", data);
    }

    /**
     *
     * @param schemaFormData
     */
    onSubmit(schemaFormData: SchemaFormData) {

        log.info("onSubmit: ", schemaFormData);

        let archetype = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

        let flashcard = SchemaFormFlashcardConverter.convert(schemaFormData, archetype);

        let annotationDescriptor
            = AnnotationDescriptor.newInstance(AnnotationType.FLASHCARD,
                                               flashcard.id,
                                               this.annotationDescriptor.docFingerprint,
                                               this.annotationDescriptor.pageNum);

        let annotationContainer = AnnotationContainer.newInstance(annotationDescriptor, flashcard);

        //
        // let createAnnotationRequest
        //     = new CreateAnnotationRequest(this.createFlashcardRequest.docDescriptor,
        //                                   AnnotationType.FLASHCARD,
        //                                   schemaFormData);

        // // FIXME: ok.. we can't just use a generic
        //
        // // FIXME: this is broken..
        // // the metadata for creating the flashcard type.  This should probably
        // // move to the schema in the future.  The ID is really just so that
        // // we can compile the schema properly.
        // schemaFormData.flashcard = {
        //     id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        // };

        // send this to the main process which then broadcasts it to all the
        // renderers

        // FIXME: this is a NEW request.. not a new response..
        //this.response.send('/api/annotations/create-annotation', annotationContainer);

        // FIXME: use an IPC client here...
        //ipcRenderer.send('created-annotation', annotationContainer);

    }

    onError(data: any) {
        log.info("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)},
        // "*");
    }

}


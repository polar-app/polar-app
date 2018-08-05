import {CreateFlashcardForm} from '../elements/schemaform/CreateFlashcardForm';
import {IPCHandler} from '../../../ipc/handler/IPCHandler';
import {AnnotationDescriptor} from '../../../metadata/AnnotationDescriptor';
import {IPCEvent} from '../../../ipc/handler/IPCEvent';
import {IPCMessage} from '../../../ipc/handler/IPCMessage';
import {AnnotationDescriptors} from '../../../metadata/AnnotationDescriptors';
import {PostMessageFormHandler} from '../flashcards/PostMessageFormHandler';
import {Logger} from '../../../logger/Logger';

const log = Logger.create();

export class CreateFlashcardHandler extends IPCHandler<AnnotationDescriptor> {

    private readonly createFlashcardForm: CreateFlashcardForm;

    constructor(createFlashcardForm: CreateFlashcardForm) {
        super();
        this.createFlashcardForm = createFlashcardForm;
    }

    protected createValue(ipcMessage: IPCMessage<any>): AnnotationDescriptor {
        return AnnotationDescriptors.createFromObject(ipcMessage.value);
    }

    protected async handleIPC(event: IPCEvent, annotationDescriptor: AnnotationDescriptor): Promise<any> {
        log.info("Creating new post message for connected to annotation annotationDescriptor: ", annotationDescriptor);
        this.createFlashcardForm.formHandler = new PostMessageFormHandler(annotationDescriptor, event.response);
        return true;
    }

}

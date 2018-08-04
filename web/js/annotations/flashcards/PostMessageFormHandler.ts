import {ipcRenderer} from 'electron';
import {FormHandler} from "../FormHandler";
import {AnnotationType} from "../../metadata/AnnotationType";
import {Logger} from "../../logger/Logger";
import {CreateAnnotationRequest} from '../../flashcards/controller/CreateAnnotationRequest';
import {SchemaFormData} from '../elements/schemaform/SchemaFormData';
import {SchemaFormFlashcardConverter} from './SchemaFormFlashcardConverter';
import {AnnotationDescriptor} from '../../metadata/AnnotationDescriptor';
import {AnnotationContainer} from '../../metadata/AnnotationContainer';
import {CreateFlashcardRequest} from '../../apps/card_creator/CreateFlashcardRequest';

const log = Logger.create();

export class PostMessageFormHandler extends FormHandler {

    private readonly createFlashcardRequest: CreateFlashcardRequest;

    constructor(createFlashcardRequest: CreateFlashcardRequest) {
        super();
        this.createFlashcardRequest = createFlashcardRequest;
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
            = new AnnotationDescriptor(AnnotationType.FLASHCARD,
            flashcard.id,
            this.createFlashcardRequest.docDescriptor.fingerprint, this.createFlashcardRequest.pageNum)''

        let annotationContainer = new AnnotationContainer(this.parentAnnotation, flashcard);

        // FIXME: refactor this to send a typed data structure.

        schemaFormData = Object.assign({}, schemaFormData);

        let createAnnotationRequest
            = new CreateAnnotationRequest(this.createFlashcardRequest.docDescriptor,
                                          AnnotationType.FLASHCARD,
                                          schemaFormData);

        // FIXME: ok.. we can't just use a generic

        // FIXME: this is broken..
        // the metadata for creating the flashcard type.  This should probably
        // move to the schema in the future.  The ID is really just so that
        // we can compile the schema properly.
        schemaFormData.flashcard = {
            id: "9d146db1-7c31-4bcf-866b-7b485c4e50ea"
        };

        // send this to the main process which then broadcasts it to all the
        // renderers
        ipcRenderer.send('create-annotation', schemaFormData);

    }

    onError(data: any) {
        log.info("onError: ", data);
        //window.postMessage({ type: "onError", data: dataToExternal(data)},
        // "*");
    }

}


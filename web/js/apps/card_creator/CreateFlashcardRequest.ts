import {DocDescriptor} from '../../metadata/DocDescriptor';


export class CreateFlashcardRequest {

    public readonly docDescriptor: DocDescriptor;

    constructor(docDescriptor: DocDescriptor) {
        this.docDescriptor = docDescriptor;
    }

    static create(opts: any): CreateFlashcardRequest {
        let result = Object.create(CreateFlashcardRequest.prototype);
        Object.assign(result, opts);
        return result;
    }

}

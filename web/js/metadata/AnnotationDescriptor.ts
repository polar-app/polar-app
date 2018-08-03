import {AnnotationType} from './AnnotationType';

/**
 * High level descriptor for an annotation.  Used so that we can references
 * a specific annotation that might actually not be created yet or we just
 * want a reference without the full descriptor.
 */
export class AnnotationDescriptor {

    public readonly type: AnnotationType;
    public readonly id: string;
    public readonly docFingerprint: string;
    public readonly pageNum: number;

    constructor(type: AnnotationType, id: string, docFingerprint: string, pageNum: number) {
        this.type = type;
        this.id = id;
        this.docFingerprint = docFingerprint;
        this.pageNum = pageNum;
    }

}

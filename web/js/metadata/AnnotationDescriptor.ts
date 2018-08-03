import {AnnotationType} from './AnnotationType';
import {Preconditions} from '../Preconditions';

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
        this.type = Preconditions.assertNotNull(type, "type");
        this.id = Preconditions.assertNotNull(id, "id");
        this.docFingerprint = Preconditions.assertNotNull(docFingerprint, "docFingerprint");
        this.pageNum = Preconditions.assertNotNull(pageNum, "pageNum");
    }

}

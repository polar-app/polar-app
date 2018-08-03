import {AnnotationDescriptor} from './AnnotationDescriptor';
import {AnnotationTypes} from './AnnotationType';

export class AnnotationDescriptors {

    static fromElement(element: HTMLElement) {

        let dataAttributes = Attributes.dataToMap(element);

        let annotationType = AnnotationTypes.fromString(dataAttributes['annotation-type']);
        let id = AnnotationTypes.fromString(dataAttributes['annotation-id']);
        let docFingerprint = AnnotationTypes.fromString(dataAttributes['annotation-doc-fingerprint']);
        let pageNum = parseInt(AnnotationTypes.fromString(dataAttributes['annotation-page-num']));

        return new AnnotationDescriptor(annotationType, docFingerprint, id, pageNum);

    }

}

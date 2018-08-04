import {Annotation} from './Annotation';
import {AnnotationDescriptor} from './AnnotationDescriptor';

export class AnnotationContainer<A extends Annotation> {

    public readonly annotationDescriptor: AnnotationDescriptor;

    public readonly annotation: A;

    constructor(annotationDescriptor: AnnotationDescriptor, annotation: A) {
        this.annotationDescriptor = annotationDescriptor;
        this.annotation = annotation;
    }

}

import {Annotation} from './Annotation';
import {AnnotationType} from './AnnotationType';

class AnnotationContainer<A extends Annotation> {

    public readonly annotationType: AnnotationType = AnnotationType.FLASHCARD;

    public readonly annotation: A;

    constructor(annotationType: AnnotationType, annotation: A) {
        this.annotationType = annotationType;
        this.annotation = annotation;
    }

}

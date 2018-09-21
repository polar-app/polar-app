import {AnnotationEvent} from './AnnotationEvent';

export interface AnnotationEventListener {

    // noinspection TsLint
    (annotationEvent: AnnotationEvent): void;
}

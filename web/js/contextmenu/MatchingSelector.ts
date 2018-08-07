import {AnnotationDescriptor} from '../metadata/AnnotationDescriptor';

export class MatchingSelector {

    public readonly selector: string;
    public readonly elements: HTMLElement[];
    public readonly annotationDescriptors: AnnotationDescriptor[];

    constructor(selector: string, elements: HTMLElement[], annotationDescriptors: AnnotationDescriptor[]) {
        this.selector = selector;
        this.elements = elements;
        this.annotationDescriptors = annotationDescriptors;
    }

}

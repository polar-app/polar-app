import {DocAnnotationMap, SortedDocAnnotations} from './DocAnnotation';

export class DocAnnotationIndex {

    public readonly docAnnotationMap: DocAnnotationMap = {};
    public readonly sortedDocAnnotation: SortedDocAnnotations = [];

    constructor(docAnnotationMap: DocAnnotationMap = {}, sortedDocAnnotation: SortedDocAnnotations = []) {
        this.docAnnotationMap = docAnnotationMap;
        this.sortedDocAnnotation = sortedDocAnnotation;
    }

}



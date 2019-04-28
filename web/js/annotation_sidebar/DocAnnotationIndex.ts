import {DocAnnotationMap, SortedDocAnnotations} from './DocAnnotation';

export class DocAnnotationIndex {

    public readonly docAnnotationMap: DocAnnotationMap = {};
    public readonly sortedDocAnnotations: SortedDocAnnotations = [];

    constructor(docAnnotationMap: DocAnnotationMap = {},
                sortedDocAnnotation: SortedDocAnnotations = []) {

        this.docAnnotationMap = docAnnotationMap;
        this.sortedDocAnnotations = sortedDocAnnotation;

    }

}



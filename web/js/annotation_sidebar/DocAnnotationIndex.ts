import {DocAnnotation, DocAnnotationMap, SortedDocAnnotations} from './DocAnnotation';
import {ArrayListMultimap} from "../util/Multimap";

export class DocAnnotationIndex {

    public readonly docAnnotationMap: DocAnnotationMap = {};
    public readonly sortedDocAnnotations: SortedDocAnnotations = [];

    public readonly children = new ArrayListMultimap<string, DocAnnotation>();

    constructor(docAnnotationMap: DocAnnotationMap = {},
                sortedDocAnnotation: SortedDocAnnotations = []) {

        this.docAnnotationMap = docAnnotationMap;
        this.sortedDocAnnotations = sortedDocAnnotation;

    }

    public getChildren(id: IDString): ReadonlyArray<DocAnnotation> {
        return this.children.get(id);
    }

    public setChildren(id: IDString, children: ReadonlyArray<DocAnnotation>): void {
        this.children.putAll(id, children);
    }

    public addChild(id: IDString, docAnnotation: DocAnnotation) {
        this.children.put(id, docAnnotation);

        // this.children.push(docAnnotation);
        // this.children.sort((c0, c1) => -c0.created.localeCompare(c1.created));
    }

    public removeChild(id: IDString, child: IDString) {
        this.children.delete(id, undefined, (value: DocAnnotation) => value.id === id);
    }
}

export type IDString = string;

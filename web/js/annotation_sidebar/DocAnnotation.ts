import {AnnotationType} from '../metadata/AnnotationType';
import {Comment} from '../metadata/Comment';
import {Point} from '../Point';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {PageMeta} from '../metadata/PageMeta';
import {HTMLString} from '../util/HTMLString';
import {Ref} from '../metadata/Refs';
import {Flashcard} from '../metadata/Flashcard';
import {AreaHighlight} from '../metadata/AreaHighlight';
import {TextHighlight} from '../metadata/TextHighlight';
import {ObjectID} from '../util/ObjectIDs';
import {Img} from '../metadata/Img';
import {HighlightColor} from '../metadata/HighlightColor';
import {DocMeta} from '../metadata/DocMeta';
import {Author} from "../metadata/Author";
import {DocAnnotationIndex} from "./DocAnnotationIndex";

export interface IDocAnnotation extends ObjectID {

    readonly id: string;
    readonly annotationType: AnnotationType;
    readonly html?: HTMLString;
    readonly fields?: {[name: string]: HTMLString};
    readonly pageNum: number;
    readonly position: Point;
    readonly created: ISODateTimeString;

    // the reference to a parent annotation if this is a child annotation.
    readonly ref?: Ref;

    readonly img?: Img;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    readonly color?: HighlightColor;

    readonly docMeta: DocMeta;

    readonly pageMeta: PageMeta;

    readonly original: Comment | Flashcard | AreaHighlight | TextHighlight;

    readonly author?: Author;

    readonly immutable: boolean;
}

export interface DocAnnotation extends IDocAnnotation {

    getChildren(): ReadonlyArray<DocAnnotation>;

    setChildren(children: ReadonlyArray<DocAnnotation>): void;

    addChild(docAnnotation: DocAnnotation): void;

    removeChild(id: string): void;

}

export class DefaultDocAnnotation implements DocAnnotation {

    private readonly getIndex: () => DocAnnotationIndex;

    public readonly oid: number;

    public readonly id: string;
    public readonly annotationType: AnnotationType;
    public readonly html?: HTMLString;
    public readonly fields?: {[name: string]: HTMLString};
    public readonly pageNum: number;
    public readonly position: Point;
    public readonly created: ISODateTimeString;

    // the reference to a parent annotation if this is a child annotation.
    public readonly ref?: Ref;

    public readonly img?: Img;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    public readonly color?: HighlightColor;

    public readonly docMeta: DocMeta;

    public readonly pageMeta: PageMeta;

    public readonly original: Comment | Flashcard | AreaHighlight | TextHighlight;

    public readonly author?: Author;

    public readonly immutable: boolean;

    constructor(readonly index: DocAnnotationIndex,
                public readonly obj: IDocAnnotation) {

        this.getIndex = () => index;

        this.oid = obj.oid;
        this.id = obj.id;
        this.annotationType = obj.annotationType;
        this.html = obj.html;
        this.fields = obj.fields;
        this.pageNum = obj.pageNum;
        this.position = obj.position;
        this.created = obj.created;
        this.ref = obj.ref;
        this.img = obj.img;
        this.color = obj.color;
        this.docMeta = obj.docMeta;
        this.pageMeta = obj.pageMeta;
        this.original = obj.original;
        this.author = obj.author;
        this.immutable = obj.immutable;

    }

    public getChildren(): ReadonlyArray<DocAnnotation> {
        return this.getIndex()._getChildren(this.id);
    }

    public setChildren(children: ReadonlyArray<DocAnnotation>): void {
        this.getIndex()._setChildren(this.id, children);
    }

    public addChild(docAnnotation: DocAnnotation) {
        this.getIndex()._addChild(this.id, docAnnotation);

        // this.children.push(docAnnotation);
        // this.children.sort((c0, c1) => -c0.created.localeCompare(c1.created));
    }

    public removeChild(id: string) {
        this.getIndex()._removeChild(this.id, id);
    }

}

/**
 * A map from ID to the actual DocAnnotation.
 */
// noinspection TsLint: interface-over-type-literal
export type DocAnnotationMap = {[id: string]: DefaultDocAnnotation};

/**
 * Annotations according to their position in the document.
 */
export type SortedDocAnnotations = DocAnnotation[];

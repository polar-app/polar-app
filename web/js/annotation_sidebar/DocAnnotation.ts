import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Point} from '../Point';
import {ISODateTimeString} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {HTMLString} from '../util/HTMLString';
import {IRef, Ref, Refs} from 'polar-shared/src/metadata/Refs';
import {ObjectID} from '../util/ObjectIDs';
import {Img} from 'polar-shared/src/metadata/Img';
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {
    AnnotationOrder,
    HighlightColor
} from "polar-shared/src/metadata/IBaseHighlight";
import {IAuthor} from "polar-shared/src/metadata/IAuthor";
import {RepoAnnotation} from "../../../apps/repository/js/RepoAnnotation";
import {IDStr, PlainTextStr} from "polar-shared/src/util/Strings";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {InheritedTag} from 'polar-shared/src/tags/InheritedTags';
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {DocAnnotations} from "./DocAnnotations";
import {IDocMetaRef} from "polar-shared/src/metadata/AnnotationRefs";

export interface IDocAnnotation extends ObjectID, RepoAnnotation {

    /**
     * The document fingerprint this annotation belongs to.
     */
    readonly fingerprint: string;

    readonly id: IDStr;
    readonly guid: IDStr;
    readonly annotationType: AnnotationType;
    readonly html: HTMLString | undefined;
    readonly fields?: {[name: string]: HTMLString};
    readonly pageNum: number;
    readonly position: Point;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;

    /**
     * the reference to a parent annotation if this is a child annotation.
     */
    readonly ref: Ref | undefined;

    readonly parent: IRef | undefined;

    readonly img: Img | undefined;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    readonly color: HighlightColor | undefined;

    // TODO: REACT POINTER ISSUE
    readonly docMeta: IDocMeta;
    readonly docInfo: IDocInfo;
    readonly pageMeta: IPageMeta;

    // TODO: REACT POINTER ISSUE
    readonly original: IComment | IFlashcard | IAreaHighlight | ITextHighlight;

    readonly author?: IAuthor;

    readonly immutable: boolean;

    /**
     * The effective tags for this item including any inherited tags from parent
     * objects like flashcards, comments, etc.
     */
    readonly tags: Readonly<{[id: string]: InheritedTag}> | undefined;

    readonly order: AnnotationOrder | undefined;

    /**
     * A reference to the IDocMeta so we can lookup by ID.
     */
    readonly docMetaRef: IDocMetaRef;

    // TODO: REACT POINTER ISSUE.  FIXME: not sure if this one will be an issue.
    readonly children: () => ReadonlyArray<IDocAnnotation>;

}

/**
 * Ref object that excludes important that are bloated and we don't need in
 * the react components.
 */
export interface IDocAnnotationRef extends Omit<IDocAnnotation, 'docMeta' | 'docInfo' | 'pageMeta' | 'children'> {

    readonly children: () => ReadonlyArray<IDocAnnotationRef>;

    /**
     * A reference to the IDocMeta so we can lookup by ID.
     */
    readonly docMetaRef: IDocMetaRef;

}

// TODO we need a full doc annotation including children and a way to manage
// them over time for the annotation repository. Create a NEW interface that
// just has a children getter prop so that we can keep a graph props including
// their parent and children.

export interface DocAnnotation extends IDocAnnotation {

    getChildren(): ReadonlyArray<DocAnnotation>;

    setChildren(children: ReadonlyArray<DocAnnotation>): void;

    addChild(docAnnotation: DocAnnotation): void;

    removeChild(id: string): void;

}

/**
 *
 */
export function createChildren(original: IAreaHighlight | ITextHighlight,
                               docMeta: IDocMeta,
                               pageMeta: IPageMeta): () => ReadonlyArray<IDocAnnotation> {

    return () => {

        const flashcards = Object.values(pageMeta.flashcards || {});
        const comments = Object.values(pageMeta.comments || {});

        function isReferenced(annotation: IComment | IFlashcard): boolean {

            if (! annotation.ref) {
                return false;
            }

            const parsedRef = Refs.parse(annotation.ref);

            return parsedRef.value === original.id || parsedRef.value === original.guid;

        }

        const flashcardAnnotations
            = flashcards.filter(isReferenced)
                        .map(annotation => DocAnnotations.createFromFlashcard(docMeta, annotation, pageMeta));

        const commentAnnotations
            = comments.filter(isReferenced)
                        .map(annotation => DocAnnotations.createFromComment(docMeta, annotation, pageMeta));


        const resolved = [
            ...flashcardAnnotations,
            ...commentAnnotations
        ];

        return resolved;

    };

}

export class DefaultDocAnnotation implements DocAnnotation {

    private readonly getIndex: () => DocAnnotationIndex;

    public readonly oid: number;

    public readonly id: IDStr;
    public readonly guid: IDStr;
    public readonly fingerprint: IDStr;
    public readonly docInfo: IDocInfo;
    public readonly annotationType: AnnotationType;
    public readonly text: PlainTextStr | undefined;
    public readonly html: HTMLString | undefined;
    public readonly fields?: {[name: string]: HTMLString};
    public readonly pageNum: number;
    public readonly position: Point;
    public readonly created: ISODateTimeString;
    public readonly lastUpdated: ISODateTimeString;

    // the reference to a parent annotation if this is a child annotation.
    public readonly ref: Ref | undefined;

    public readonly img: Img | undefined;

    /**
     * The color for highlights.  When undefined there is no color (which would
     * work for comments, etc)
     */
    public readonly color: HighlightColor | undefined;

    public readonly docMeta: IDocMeta;

    public readonly pageMeta: IPageMeta;

    public readonly original: IComment | IFlashcard | IAreaHighlight | ITextHighlight;

    public readonly author?: IAuthor;

    public readonly immutable: boolean;

    public readonly tags: Readonly<{[id: string]: InheritedTag}> | undefined;

    public readonly parent: IRef | undefined;

    public readonly docMetaRef: IDocMetaRef;

    public readonly order: AnnotationOrder | undefined;

    constructor(readonly index: DocAnnotationIndex,
                public readonly obj: IDocAnnotation) {

        this.getIndex = () => index;

        this.oid = obj.oid;
        this.id = obj.id;
        this.guid = obj.guid;
        this.fingerprint = obj.fingerprint;
        this.docInfo = obj.docInfo;
        this.annotationType = obj.annotationType;
        this.text = obj.text;
        this.html = obj.html;
        this.fields = obj.fields;
        this.pageNum = obj.pageNum;
        this.position = obj.position;
        this.created = obj.created;
        this.lastUpdated = obj.lastUpdated || obj.created;
        this.ref = obj.ref;
        this.img = obj.img;
        this.color = obj.color;
        this.docMeta = obj.docMeta;
        this.pageMeta = obj.pageMeta;
        this.original = obj.original;
        this.author = obj.author;
        this.immutable = obj.immutable;
        this.tags = obj.tags;
        this.parent = obj.parent;
        this.docMetaRef = {
            id: obj.docInfo.fingerprint
        };
        this.order = obj.order;

    }

    public getChildren(): ReadonlyArray<DocAnnotation> {
        return arrayStream(this.getIndex()._getChildren(this.id))
                .unique(current => current.id)
                .collect();
    }

    public children() {
        return this.getChildren();
    }

    public setChildren(children: ReadonlyArray<DocAnnotation>): void {
        this.getIndex()._setChildren(this.id, children);
    }

    public addChild(docAnnotation: DocAnnotation) {
        this.getIndex()._addChild(this.id, docAnnotation);
    }

    public removeChild(id: string) {
        this.getIndex()._removeChild(this.id, id);
    }

}

/**
 * A map from ID to the actual DocAnnotation.
 */
export interface DocAnnotationMap {
    [id: string]: DefaultDocAnnotation;
}

/**
 * Annotations according to their position in the document.
 */
export type SortedDocAnnotations = DocAnnotation[];

import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {
    createChildren,
    IDocAnnotation,
    IDocAnnotationRef
} from './DocAnnotation';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Flashcards} from '../metadata/Flashcards';
import {Point} from '../Point';
import {ObjectIDs} from '../util/ObjectIDs';
import {Images} from '../metadata/Images';
import {DocAnnotationIndex} from "./DocAnnotationIndex";
import {DocFileResolver} from "../datastore/DocFileResolvers";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IBaseHighlight} from "polar-shared/src/metadata/IBaseHighlight";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IComment} from "polar-shared/src/metadata/IComment";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IAuthor} from "polar-shared/src/metadata/IAuthor";
import {IRect} from 'polar-shared/src/util/rects/IRect';
import {Providers} from "polar-shared/src/util/Providers";
import {AnnotationTexts} from "polar-shared/src/metadata/AnnotationTexts";
import {PlainTextStr} from "polar-shared/src/util/Strings";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {HighlightColors} from "polar-shared/src/metadata/HighlightColor";
import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {
    InheritedTag,
    toSelfInheritedTags
} from "polar-shared/src/tags/InheritedTags";
import {Refs} from "polar-shared/src/metadata/Refs";
import {IDocMetaRef} from "polar-shared/src/metadata/AnnotationRefs";

export namespace DocAnnotations {

    /**
     * Convert this to a lightweight ref that can be used without triggering
     * component re-render in React.
     */
    export function toRef(docAnnotation: IDocAnnotation): IDocAnnotationRef {

        const children = docAnnotation.children().map(toRef);

        const docMetaRef: IDocMetaRef = {
            id: docAnnotation.docMeta.docInfo.fingerprint
        };

        const tmp: any = {...docAnnotation};

        delete tmp.docMeta;
        delete tmp.docInfo;
        delete tmp.pageMeta;
        delete tmp.index;
        delete tmp.obj;
        delete tmp.oid;
        delete tmp.getIndex;

        const result: IDocAnnotationRef = {
            ...tmp,
            docMetaRef,
            children: () => children
        }

        return result;

    }

    function isImmutable(author?: IAuthor) {

        if (author && author.guest) {
            return true;
        }

        return false;

    }

    export async function getAnnotationsForPage(docFileResolver: DocFileResolver,
                                                docAnnotationIndex: DocAnnotationIndex,
                                                docMeta: IDocMeta): Promise<IDocAnnotation[]> {

        const result: IDocAnnotation[] = [];

        const pageMetas = Object.values(docMeta.pageMetas);

        for (const pageMeta of pageMetas) {

            const areaHighlights = await getAreaHighlights(docFileResolver, docMeta, pageMeta);
            const textHighlights = getTextHighlights(docMeta, pageMeta);

            result.push(...textHighlights);
            result.push(...areaHighlights);

        }

        return result;

    }

    export function createFromFlashcard(docMeta: IDocMeta,
                                      annotation: IFlashcard,
                                      pageMeta: IPageMeta): IDocAnnotation {

        const textConverter = ITextConverters.create(AnnotationType.FLASHCARD, annotation);

        const init = createInit(docMeta);

        const parent = annotation.ref ? Refs.parse(annotation.ref) : undefined;

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: annotation.id,
            guid: annotation.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...textConverter,
            fields: Flashcards.convertFieldsToMap(annotation.fields),
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: annotation.created,
            lastUpdated: annotation.lastUpdated || annotation.created,
            docMeta,
            pageMeta,
            ref: annotation.ref,
            parent,
            original: annotation,
            author: annotation.author,
            immutable: isImmutable(annotation.author),
            color: undefined,
            img: undefined,
            tags: {...toSelfInheritedTags(annotation.tags), ...init.tags},
            children: () => [],
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            order: undefined
        };

    }

    export function createFromComment(docMeta: IDocMeta,
                                    annotation: IComment,
                                    pageMeta: IPageMeta): IDocAnnotation {

        const iTextConverter = ITextConverters.create(AnnotationType.COMMENT, annotation);

        const init = createInit(docMeta);

        const parent = annotation.ref ? Refs.parse(annotation.ref) : undefined;

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: annotation.id,
            guid: annotation.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...iTextConverter,
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: annotation.created,
            lastUpdated: annotation.lastUpdated || annotation.created,
            docMeta,
            pageMeta,
            ref: annotation.ref,
            parent,
            original: annotation,
            author: annotation.author,
            immutable: isImmutable(annotation.author),
            color: undefined,
            img: undefined,
            tags: {...toSelfInheritedTags(annotation.tags), ...init.tags},
            children: () => [],
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            order: undefined
        };

    }

    export function createFromAreaHighlight(docFileResolver: DocFileResolver,
                                            docMeta: IDocMeta,
                                            annotation: IAreaHighlight,
                                            pageMeta: IPageMeta): IDocAnnotation {

        const createPosition = (): Point => {

            if (annotation.position) {
                return {...annotation.position};
            }

            return {
                x: firstRect(annotation).map(current => current.left).getOrElse(0),
                y: firstRect(annotation).map(current => current.top).getOrElse(0),
            };

        };

        const img = Providers.memoize(() => Images.toImg(docFileResolver, annotation.image));

        const position = createPosition();

        const init = createInit(docMeta);

        const children = createChildren(annotation, docMeta, pageMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: annotation.id,
            guid: annotation.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            annotationType: AnnotationType.AREA_HIGHLIGHT,
            get img() {
                return img();
            },
            text: undefined,
            html: undefined,
            pageNum: pageMeta.pageInfo.num,
            position,
            color: HighlightColors.withDefaultColor(annotation.color),
            created: annotation.created,
            lastUpdated: annotation.lastUpdated || annotation.created,
            docMeta,
            pageMeta,
            ref: undefined,
            parent: undefined,
            original: annotation,
            author: annotation.author,
            tags: {...toSelfInheritedTags(annotation.tags), ...init.tags},
            immutable: isImmutable(annotation.author),
            children,
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            order: annotation.order
        };

    }

    export function createFromTextHighlight(docMeta: IDocMeta,
                                            annotation: ITextHighlight,
                                            pageMeta: IPageMeta): IDocAnnotation {

        const iTextConverter = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, annotation);

        const init = createInit(docMeta);

        const children = createChildren(annotation, docMeta, pageMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: annotation.id,
            guid: annotation.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...iTextConverter,
            pageNum: pageMeta.pageInfo.num,
            position: {
                x: firstRect(annotation).map(current => current.left).getOrElse(0),
                y: firstRect(annotation).map(current => current.top).getOrElse(0),
            },
            color: HighlightColors.withDefaultColor(annotation.color),
            created: annotation.created,
            lastUpdated: annotation.lastUpdated || annotation.created,
            docMeta,
            pageMeta,
            ref: undefined,
            parent: undefined,
            original: annotation,
            author: annotation.author,
            immutable: isImmutable(annotation.author),
            tags: {...toSelfInheritedTags(annotation.tags), ...init.tags},
            img: undefined,
            children,
            docMetaRef: {
                id: docMeta.docInfo.fingerprint
            },
            order: annotation.order
        };

    }

    function getTextHighlights(docMeta: IDocMeta, pageMeta: IPageMeta): ReadonlyArray<IDocAnnotation> {

        const textHighlights = Object.values(pageMeta.textHighlights);

        return textHighlights.map(textHighlight => {
            return createFromTextHighlight(docMeta, textHighlight, pageMeta);
        });

    }

    async function getAreaHighlights(docFileResolver: DocFileResolver,
                                     docMeta: IDocMeta,
                                     pageMeta: IPageMeta): Promise<IDocAnnotation[]> {

        const result: IDocAnnotation[] = [];

        const areaHighlights = Object.values(pageMeta.areaHighlights);

        for (const areaHighlight of areaHighlights) {

            const docAnnotation = createFromAreaHighlight(docFileResolver, docMeta, areaHighlight, pageMeta);

            result.push(docAnnotation);

        }

        return result;

    }

    function createInit(docMeta: IDocMeta): DocAnnotationInit {

        const toInheritedTag = (tag: Tag): InheritedTag => {
            return {
                source: 'doc',
                ...tag
            };
        };

        const tags =
            arrayStream(Object.values(docMeta.docInfo.tags || {}))
                .map(toInheritedTag)
                .toMap(current => current.id);

        return {
            tags: {...tags}
        };

    }

    function firstRect(highlight: IBaseHighlight): Optional<IRect> {
        return Optional.of(highlight)
            .map(current => current.rects)
            .map(current => current[0]);
    }

}

/**
 * Properties present in most annotations that will be used the same.
 */
interface DocAnnotationInit {
    readonly tags: Readonly<{[id: string]: InheritedTag}> | undefined;
}

class ITextConverters {

    public static create(annotationType: AnnotationType,
                         annotation: ITextHighlight | IAreaHighlight | IComment | IFlashcard): ITextConverter {

        const toText = Providers.memoize(() => AnnotationTexts.toText(annotationType, annotation));
        const toHTML = Providers.memoize(() => AnnotationTexts.toHTML(annotationType, annotation));

        return {
            annotationType,
            get text() {
                return toText();
            },
            get html() {
                return toHTML();
            },
        };

    }

}

interface ITextConverter {
    readonly annotationType: AnnotationType;
    readonly text: PlainTextStr | undefined;
    readonly html: PlainTextStr | undefined;
}



import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {IDocAnnotation, InheritedTag} from './DocAnnotation';
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

export class DocAnnotations {

    private static isImmutable(author?: IAuthor) {

        if (author && author.guest) {
            return true;
        }

        return false;

    }

    public static async getAnnotationsForPage(docFileResolver: DocFileResolver,
                                              docAnnotationIndex: DocAnnotationIndex,
                                              docMeta: IDocMeta): Promise<IDocAnnotation[]> {

        const result: IDocAnnotation[] = [];

        const pageMetas = Object.values(docMeta.pageMetas);

        for (const pageMeta of pageMetas) {

            const areaHighlights = await this.getAreaHighlights(docFileResolver, docMeta, pageMeta);
            const textHighlights = this.getTextHighlights(docMeta, pageMeta);

            result.push(...textHighlights);
            result.push(...areaHighlights);

        }

        return result;

    }

    public static createFromFlashcard(docMeta: IDocMeta,
                                      flashcard: IFlashcard,
                                      pageMeta: IPageMeta): IDocAnnotation {

        const textConverter = ITextConverters.create(AnnotationType.FLASHCARD, flashcard);

        const init = this.createInit(docMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: flashcard.id,
            guid: flashcard.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...textConverter,
            fields: Flashcards.convertFieldsToMap(flashcard.fields),
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: flashcard.created,
            docMeta,
            pageMeta,
            ref: flashcard.ref,
            original: flashcard,
            author: flashcard.author,
            immutable: this.isImmutable(flashcard.author),
            color: undefined,
            img: undefined,
            tags: {...toSelfInheritedTags(flashcard.tags), ...init.tags},
        };

    }

    public static createFromComment(docMeta: IDocMeta,
                                    comment: IComment,
                                    pageMeta: IPageMeta): IDocAnnotation {

        const iTextConverter = ITextConverters.create(AnnotationType.COMMENT, comment);

        const init = this.createInit(docMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: comment.id,
            guid: comment.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...iTextConverter,
            pageNum: pageMeta.pageInfo.num,
            // irrelevant on comments
            position: {
                x: 0,
                y: 0
            },
            created: comment.created,
            docMeta,
            pageMeta,
            ref: comment.ref,
            original: comment,
            author: comment.author,
            immutable: this.isImmutable(comment.author),
            color: undefined,
            img: undefined,
            tags: {...toSelfInheritedTags(comment.tags), ...init.tags},
        };

    }

    public static createFromAreaHighlight(docFileResolver: DocFileResolver,
                                          docMeta: IDocMeta,
                                          areaHighlight: IAreaHighlight,
                                          pageMeta: IPageMeta): IDocAnnotation {

        const createPosition = (): Point => {

            if (areaHighlight.position) {
                return {...areaHighlight.position};
            }

            return {
                x: this.firstRect(areaHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(areaHighlight).map(current => current.top).getOrElse(0),
            };

        };

        const img = Providers.memoize(() => Images.toImg(docFileResolver, areaHighlight.image));

        const position = createPosition();

        const init = this.createInit(docMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: areaHighlight.id,
            guid: areaHighlight.guid,
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
            color: HighlightColors.withDefaultColor(areaHighlight.color),
            created: areaHighlight.created,
            docMeta,
            pageMeta,
            original: areaHighlight,
            author: areaHighlight.author,
            tags: {...toSelfInheritedTags(areaHighlight.tags), ...init.tags},
            immutable: this.isImmutable(areaHighlight.author),
        };

    }

    public static createFromTextHighlight(docMeta: IDocMeta,
                                          textHighlight: ITextHighlight,
                                          pageMeta: IPageMeta): IDocAnnotation {

        const iTextConverter = ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, textHighlight);

        const init = this.createInit(docMeta);

        return {
            ...init,
            oid: ObjectIDs.create(),
            id: textHighlight.id,
            guid: textHighlight.guid,
            fingerprint: docMeta.docInfo.fingerprint,
            docInfo: docMeta.docInfo,
            ...iTextConverter,
            pageNum: pageMeta.pageInfo.num,
            position: {
                x: this.firstRect(textHighlight).map(current => current.left).getOrElse(0),
                y: this.firstRect(textHighlight).map(current => current.top).getOrElse(0),
            },
            color: HighlightColors.withDefaultColor(textHighlight.color),
            created: textHighlight.created,
            docMeta,
            pageMeta,
            original: textHighlight,
            author: textHighlight.author,
            immutable: this.isImmutable(textHighlight.author),
            tags: {...toSelfInheritedTags(textHighlight.tags), ...init.tags},
            img: undefined
        };

    }

    private static getTextHighlights(docMeta: IDocMeta, pageMeta: IPageMeta): ReadonlyArray<IDocAnnotation> {

        const textHighlights = Object.values(pageMeta.textHighlights);

        return textHighlights.map(textHighlight => {
            return this.createFromTextHighlight(docMeta, textHighlight, pageMeta);
        });

    }

    private static async getAreaHighlights(docFileResolver: DocFileResolver,
                                           docMeta: IDocMeta,
                                           pageMeta: IPageMeta): Promise<IDocAnnotation[]> {

        const result: IDocAnnotation[] = [];

        const areaHighlights = Object.values(pageMeta.areaHighlights);

        for (const areaHighlight of areaHighlights) {

            const docAnnotation =
                await this.createFromAreaHighlight(docFileResolver, docMeta, areaHighlight, pageMeta);

            result.push(docAnnotation);

        }

        return result;

    }

    private static createInit(docMeta: IDocMeta): DocAnnotationInit {

        const toInheritedTag = (tag: Tag): InheritedTag => {
            return {
                source: 'doc',
                ...tag
            };
        };

        const tags =
            arrayStream(Object.values(docMeta.docInfo.tags || {}))
                .map(toInheritedTag)
                .toMap(current => current.label);

        return {
            tags: {...tags}
        };

    }

    private static firstRect(highlight: IBaseHighlight): Optional<IRect> {
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

export interface ITagMap {
    [id: string]: Tag;
}

export interface IInheritedTagMap {
    [id: string]: InheritedTag;
}

function toSelfInheritedTags(tags: ITagMap | undefined | null): IInheritedTagMap {
    return arrayStream(Object.values(tags || {}))
            .map(toSelfInheritedTag)
            .toMap(current => current.id);
}

function toSelfInheritedTag(tag: Tag): InheritedTag {
    return {...tag, source: 'self'};
}

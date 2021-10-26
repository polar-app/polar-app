import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {Texts} from "polar-shared/src/metadata/Texts";
import {Text} from "polar-shared/src/metadata/Text";
import {Refs} from "polar-shared/src/metadata/Refs";
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {Tag} from "polar-shared/src/tags/Tags";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {AnnotationContentType, IAreaHighlightAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {DocIDStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {HTMLToMarkdown} from "polar-markdown-parser/src/HTMLToMarkdown";

export namespace BlockContentAnnotationTree {

    export type IAnnotationBase = {
        tags: ReadonlyArray<Tag>;
        children: ReadonlyArray<IAnnotation>;
    };

    /**
     * Intermediate annotation migration structures
     *
     */
    export type ITextHighlightAnnotation = Omit<ITextHighlightAnnotationContent, 'links'> & IAnnotationBase;
    export type IAreaHighlightAnnotation = Omit<IAreaHighlightAnnotationContent, 'links'> & IAnnotationBase;
    export type IFlashcardAnnotation = Omit<IFlashcardAnnotationContent, 'links'> & IAnnotationBase;
    export type ICommentAnnotation = {
        type: 'comment',
        docID: DocIDStr;
        pageNum: number;
        content: MarkdownStr,
    } & IAnnotationBase;

    export type IAnnotation = ITextHighlightAnnotation
                              | IAreaHighlightAnnotation
                              | IFlashcardAnnotation
                              | ICommentAnnotation;


    // Couldn't find a better name for this 🤷
    export type IOldAnnotation = ITextHighlight | IAreaHighlight | IComment | IFlashcard;

    /**
     * Converts a docMeta record into an annotation tree @see IAnnotation
     *
     * @param docMeta DocMeta object
     */
    export function buildDocumentAnnotationTree(docMeta: IDocMeta): ReadonlyArray<IAnnotation> {

        return Object.entries(docMeta.pageMetas)
            .flatMap(([pageNum, pageMeta]) => buildPageAnnotationTree(docMeta, +pageNum, pageMeta));

    }

    /**
     * Builds an annotation tree for a specific page in a document @see IAnnotation
     *
     * @param docMeta docMeta object
     * @param pageNum The number of page that will be processed
     * @param pageMeta pageMeta object which contains metadata about the page
     */
    export function buildPageAnnotationTree(docMeta: IDocMeta,
                                            pageNum: number,
                                            pageMeta: IPageMeta): ReadonlyArray<IAnnotation> {

        const areaHighlights = Object.values(pageMeta.areaHighlights || {});
        const textHighlights = Object.values(pageMeta.textHighlights || {});

        return [
            ...areaHighlights.map(toAreaHighlightAnnotation.bind(null, docMeta, pageNum)),
            ...textHighlights.map(toTextHighlightAnnotation.bind(null, docMeta, pageNum)),
        ];
    }

    /**
     * Convert a text highlight annotation to the intermediate format @see IAnnotation
     *
     * @param docMeta docMeta object
     * @param pageNum The page number that the text highlight belongs to
     * @param original The original text highlight annotationt to be converted
     */
    export function toTextHighlightAnnotation(docMeta: IDocMeta,
                                              pageNum: number,
                                              annotation: ITextHighlight): ITextHighlightAnnotation {

        const revisedText = annotation.revisedText
                    ? htmlToMarkdown(annotation.revisedText)
                    : htmlToMarkdown(annotation.text);

        const wikiLinks = tagsToWikiLinksStr(annotation.tags);

        return {
            type: AnnotationContentType.TEXT_HIGHLIGHT,
            pageNum,
            docID: docMeta.docInfo.fingerprint,
            children: getAnnotationChildren(docMeta, pageNum, annotation),
            tags: Object.values(annotation.tags || {}),
            value: {
                order: annotation.order,
                rects: annotation.rects,
                color: annotation.color || 'yellow',
                text: htmlToMarkdown(annotation.text),
                revisedText: `${revisedText} ${wikiLinks}`,
            }
        };

    }

    /**
     * Convert an area highlight annotation to the intermediate format @see IAnnotation
     *
     * @param docMeta docMeta object
     * @param pageNum The page number that the area highlight belongs to
     * @param original The original area highlight annotationt to be converted
     */
    export function toAreaHighlightAnnotation(docMeta: IDocMeta,
                                              pageNum: number,
                                              annotation: IAreaHighlight): IAreaHighlightAnnotation {

        return {
            type: AnnotationContentType.AREA_HIGHLIGHT,
            pageNum,
            docID: docMeta.docInfo.fingerprint,
            children: getAnnotationChildren(docMeta, pageNum, annotation),
            tags: Object.values(annotation.tags || {}),
            value: {
                color: annotation.color || 'yellow',
                rects: annotation.rects,
                image: annotation.image,
                order: annotation.order,
                position: annotation.position,
            },
        };

    }

    /**
     * Convert a flashcard annotation to the intermediate format @see IAnnotation
     *
     * @param docMeta docMeta object
     * @param pageNum The page number that the flashcard belongs to
     * @param original The original flashcard annotation to be converted
     */
    export function toFlashcardAnnotation(docMeta: IDocMeta,
                                          pageNum: number,
                                          annotation: IFlashcard): IFlashcardAnnotation {

        const getFlashcard = () => {

            if (annotation.type === FlashcardType.CLOZE) {
                return {
                    type: annotation.type,
                    fields: { text: htmlToMarkdown(annotation.fields.text) },
                };
            } else {
                return {
                    type: annotation.type,
                    fields: {
                        front: htmlToMarkdown(annotation.fields.front),
                        back: htmlToMarkdown(annotation.fields.back),
                    },
                };
            }

        };

        return {
            type: AnnotationContentType.FLASHCARD,
            pageNum,
            value: { ...getFlashcard(), archetype: annotation.archetype },
            tags: Object.values(annotation.tags || {}),
            children: [],
            docID: docMeta.docInfo.fingerprint,
        };

    }

    /**
     * Convert a comment annotation to the intermediate format @see IAnnotation
     *
     * @param docMeta docMeta object
     * @param pageNum The page number that the comment belongs to
     * @param original The original comment annotation to be converted
     */
    export function toCommentAnnotation(docMeta: IDocMeta,
                                        pageNum: number,
                                        annotation: IComment): ICommentAnnotation {

        return {
            type: 'comment',
            pageNum,
            content: htmlToMarkdown(annotation.content),
            tags: Object.values(annotation.tags || {}),
            children: [],
            docID: docMeta.docInfo.fingerprint,
        };

    }

    /**
     * Get all the children of a specific highlight
     *
     * @param docMeta docMeta object
     * @param pageNum The page number that the highlight belongs to
     * @param original The highlight whose children will be fetched
     */
    function getAnnotationChildren(docMeta: IDocMeta,
                                   pageNum: number,
                                   original: IOldAnnotation): ReadonlyArray<IFlashcardAnnotation | ICommentAnnotation> {

        const pageMeta = docMeta.pageMetas[pageNum];

        if (! pageMeta) {
            return [];
        }

        const isReferenced = (annotation: IOldAnnotation) => {
            if (! annotation.ref) {
                return false;
            }

            const parsedRef = Refs.parse(annotation.ref);

            return parsedRef.value === original.id || parsedRef.value === original.guid;
        };

        const flashcards = Object.values(pageMeta.flashcards || {});
        const comments = Object.values(pageMeta.comments || {});

        return [
            ...flashcards.filter(isReferenced).map(toFlashcardAnnotation.bind(null, docMeta, pageNum)),
            ...comments.filter(isReferenced).map(toCommentAnnotation.bind(null, docMeta, pageNum)),
        ];

    }

    /**
     * Convert a Text instance (that is used in the old annotation system) to markdown
     *
     * @param text A Text instance or a string to be converted
     */
    export function htmlToMarkdown(text: Text | string) {
        return Texts.isText(text) ? HTMLToMarkdown.html2markdown(Texts.toHTML(text) || '') : text;
    };

    /**
     * Convert tags to the notes wiki link format
     *
     * @param tagsMap Tags map
     */
    export function tagsToWikiLinksStr(tagsMap?: Record<string, Tag>): string {
        return tagsMap
            ? Object.values(tagsMap).map(tag => `[[${tag.label}]]`).join(' ')
            : '';
    }

}

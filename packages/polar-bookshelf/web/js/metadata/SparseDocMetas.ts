import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {IFlashcardMap, IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {DocMetas} from "./DocMetas";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {IAnnotationInfo} from "polar-shared/src/metadata/IAnnotationInfo";
import {IAttachment} from "polar-shared/src/metadata/IAttachment";
import {IPagemark} from "polar-shared/src/metadata/IPagemark";
import {INote} from "polar-shared/src/metadata/INote";
import {IComment} from "polar-shared/src/metadata/IComment";
import {IQuestion} from "polar-shared/src/metadata/IQuestion";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IScreenshot} from "polar-shared/src/metadata/IScreenshot";
import {IThumbnail} from "polar-shared/src/metadata/IThumbnail";
import {ReadingProgress} from "polar-shared/src/metadata/ReadingProgress";
import {IDimensions} from "polar-shared/src/util/IDimensions";

export namespace SparseDocMetas {

    export function isSparse(docMeta: any) {
        return docMeta.encodingType === 'sparse';
    }

    /**
     * Convert to sparse DocMeta without excessive PageMetas that are empty.
     */
    export function toSparse(docMeta: IDocMeta): ISparseDocMeta {

        const docMetaCopy = DocMetas.copyOf(docMeta);

        const result: ISparseDocMeta = {
            annotationInfo: docMetaCopy.annotationInfo,
            version: docMetaCopy.version,
            attachments: docMetaCopy.attachments,
            encodingType: 'sparse',
            docInfo: docMetaCopy.docInfo,
            pageMetas: {},
        };

        // *** make the pageMetas sparse
        for(const key of Object.keys(docMetaCopy.pageMetas)) {

            const pageMeta = docMetaCopy.pageMetas[key as any];

            const sparsePageMeta = SparsePageMetas.toSparse(pageMeta);

            if (sparsePageMeta) {
                result.pageMetas[key as any] = sparsePageMeta;
            }

        }

        return result;

    }

    export function fromSparse(data: any): IDocMeta {

        if (data.encodingType !== 'sparse') {
            throw new Error("Not sparse docMeta");
        }

        const result: IDocMeta = {
            docInfo: data.docInfo,
            pageMetas: {},
            annotationInfo: data.annotationInfo,
            version: data.version,
            attachments: data.attachments,
        };

        // now reconstruct the PageMetas...

        for (let idx = 1; idx <= result.docInfo.nrPages; ++idx) {
            result.pageMetas[idx] = SparsePageMetas.fromSparse(idx, data.pageMetas[idx]);
        }

        return result;

    }

}

export namespace SparsePageMetas {

    export function isSparse(pageMeta: IPageMeta): boolean {

        return SparseDictionaries.isSparse(pageMeta.pagemarks) &&
               SparseDictionaries.isSparse(pageMeta.notes) &&
               SparseDictionaries.isSparse(pageMeta.comments) &&
               SparseDictionaries.isSparse(pageMeta.questions) &&
               SparseDictionaries.isSparse(pageMeta.flashcards) &&
               SparseDictionaries.isSparse(pageMeta.textHighlights) &&
               SparseDictionaries.isSparse(pageMeta.areaHighlights) &&
               SparseDictionaries.isSparse(pageMeta.screenshots) &&
               SparseDictionaries.isSparse(pageMeta.thumbnails) &&
               SparseDictionaries.isSparse(pageMeta.readingProgress);

    }

    export function toSparse(pageMeta: IPageMeta): ISparsePageMeta | undefined {

        const _pageMeta = pageMeta as any;

        function makeFieldSparse(field: keyof IPageMeta) {

            if (SparseDictionaries.isSparse(_pageMeta[field])) {
                delete _pageMeta[field]
            }

        }

        if (pageMeta.pageInfo.dimensions) {
            _pageMeta.dim = SparseDimensions.toSparse(pageMeta.pageInfo.dimensions)
        }

        // pageInfo basically JUST has dimensions and at this point we should
        // have already encoded it in the dimensions index
        delete _pageMeta.pageInfo;

        makeFieldSparse('pagemarks');
        makeFieldSparse('notes');
        makeFieldSparse('comments');
        makeFieldSparse('questions');
        makeFieldSparse('flashcards');
        makeFieldSparse('textHighlights');
        makeFieldSparse('areaHighlights');
        makeFieldSparse('screenshots');
        makeFieldSparse('thumbnails');
        makeFieldSparse('readingProgress');

        if (Object.keys(_pageMeta).length === 0) {
            return undefined;
        }

        return _pageMeta;

    }

    export function fromSparse(pageNum: number,
                               input: ISparsePageMeta | null | undefined): IPageMeta {

        const sparsePageMeta: ISparsePageMeta = input || {};

        const dimensions = SparseDimensions.fromSparse(sparsePageMeta.dim);

        return {

            pageInfo: {
                num: pageNum,
                dimensions
            },
            pagemarks: sparsePageMeta.pagemarks || {},
            notes: sparsePageMeta.notes || {},
            comments: sparsePageMeta.comments || {},
            questions: sparsePageMeta.questions || {},
            flashcards: sparsePageMeta.flashcards || {},
            textHighlights: sparsePageMeta.textHighlights || {},
            areaHighlights: sparsePageMeta.areaHighlights || {},
            screenshots: sparsePageMeta.screenshots || {},
            thumbnails: sparsePageMeta.thumbnails || {},
            readingProgress: sparsePageMeta.readingProgress || {},

        };

    }

}

export namespace SparseDictionaries {

    export function isSparse(dict: {[id: string]: any}) {
        return Object.keys(dict || {}).length === 0;
    }

}

// a dimensions marked as ${width}x${height} or 1024x768
export type SDimensions = string;

export interface ISparseDocMeta {

    readonly encodingType: 'sparse';

    /**
     * The DocInfo which includes information like title, nrPages, etc.
     */
    docInfo: IDocInfo;

    /**
     * A sparse dictionary of page number to page metadata.
     */
    pageMetas: { [id: number]: ISparsePageMeta | null | undefined };

    /**
     * The annotation info for this document including the last annotation
     * time, progress, etc.
     */
    annotationInfo: IAnnotationInfo;

    /**
     * The version of this DocMeta version.
     */
    version: number;

    attachments: { [id: string]: IAttachment };

}

export type PageDimensionIndex = number;

export interface ISparsePageMeta {

    readonly dim?: SDimensions;

    readonly pagemarks?: { [id: string]: IPagemark } | null | undefined;

    readonly notes?: { [id: string]: INote } | null | undefined;

    readonly comments?: { [id: string]: IComment } | null | undefined;

    readonly questions?: { [id: string]: IQuestion } | null | undefined;

    readonly flashcards?: IFlashcardMap | null | undefined;

    readonly textHighlights?: { [id: string]: ITextHighlight } | null | undefined;

    readonly areaHighlights?: { [id: string]: IAreaHighlight } | null | undefined;

    readonly screenshots?: { [id: string]: IScreenshot } | null | undefined;

    readonly thumbnails?: { [id: string]: IThumbnail } | null | undefined;

    readonly readingProgress?: { [id: string]: ReadingProgress } | null | undefined;

}


export namespace SparseDimensions {

    export function toSparse(dimensions: IDimensions | undefined | null): SDimensions | null {

        if (! dimensions) {
            return null;
        }

        return `${dimensions.width}x${dimensions.height}`;
    }

    export function fromSparse(dimensions: string | undefined): IDimensions | undefined {

        if (! dimensions) {
            return undefined;
        }

        const split = dimensions.split('x');
        const width = parseInt(split[0]);
        const height = parseInt(split[1]);

        return {
            width,
            height
        };

    }

}

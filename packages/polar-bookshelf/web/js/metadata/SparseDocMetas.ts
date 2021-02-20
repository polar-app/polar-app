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
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

export namespace SparseDocMetas {

    // FIXME: encode the sparse data properly...

    /**
     * Convert to sparse DocMeta without excessive PageMetas that are empty.
     */
    export function toSparse(docMeta: IDocMeta): ISparseDocMeta {

        const docMetaCopy = DocMetas.copyOf(docMeta);

        const result: ISparseDocMeta = {
            encodingType: 'sparse',
            docInfo: docMetaCopy.docInfo,
            pageMetas: {},
            annotationInfo: docMetaCopy.annotationInfo,
            version: docMetaCopy.version,
            attachments: docMetaCopy.attachments,
            pageDimensionsIndex: [],
            pageDimensions: []
        };

        const pageDimensionsIndex =
            arrayStream(Object.values(docMetaCopy.pageMetas || {}))
                .map(current => current.pageInfo.dimensions)
                .filter(current => current !== undefined)
                .map(current => current!)
                .map(SparseDimensions.toSparse)
                .unique()
                .collect();

        // this is a lookup from the sparse page dimensions to the array index
        // lookup so we can restore it easily.
        const pageDimensionsIndexLookup =
            arrayStream(pageDimensionsIndex)
                .toMap2((current) => current, (current, index) => index);


        const pageDimensions =
            arrayStream(Object.values(docMetaCopy.pageMetas || {}))
                .map(current => current.pageInfo.dimensions)
                .filter(current => current !== undefined)
                .map(current => current!)
                .map(SparseDimensions.toSparse)
                .map(current => pageDimensionsIndexLookup[current])
                .collect();

        // *** make the pageMetas sparse
        for(const key of Object.keys(docMetaCopy.pageMetas)) {

            const pageMeta = docMetaCopy.pageMetas[key as any];

            const sparsePageMeta = SparsePageMetas.toSparse(pageMeta);

            if (sparsePageMeta) {
                result.pageMetas[key as any] = sparsePageMeta;
            }

        }

        return {
            ...result,
            pageDimensionsIndex,
            pageDimensions
        };

    }

    // FIXME: ability to omit the entire pageMeta, parts of the pageMeta , etc.
    // FIXME: ablity to encode the dimensions efficiently in a lookup vector
    // this would mean a doc with 7000 pages would compress down to 14k rather
    // than 2MB

    // export function fromSparse(data: string): IDocMeta {
    //
    // }

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

    pageDimensionsIndex: ReadonlyArray<SDimensions>;

    pageDimensions: ReadonlyArray<number>;

}

export interface ISparsePageMeta {

    readonly pageInfo: ISparsePageInfo | null | undefined;

    readonly pagemarks: { [id: string]: IPagemark } | null | undefined;

    readonly notes: { [id: string]: INote } | null | undefined;

    readonly comments: { [id: string]: IComment } | null | undefined;

    readonly questions: { [id: string]: IQuestion } | null | undefined;

    readonly flashcards: IFlashcardMap | null | undefined;

    readonly textHighlights: { [id: string]: ITextHighlight } | null | undefined;

    readonly areaHighlights: { [id: string]: IAreaHighlight } | null | undefined;

    readonly screenshots: { [id: string]: IScreenshot } | null | undefined;

    readonly thumbnails: { [id: string]: IThumbnail } | null | undefined;

    readonly readingProgress: { [id: string]: ReadingProgress } | null | undefined;

}


export interface ISparsePageInfo {

    /**
     * The page number of this page.
     */
    readonly num: number | null | undefined;

    /**
     * The dimensions, in pixels, of this page (if we have it).  Used for
     * rendering thumbnails, etc.  For HTML pages, this is the PHYSICAL rendering
     * of the page.  HTML pages can be VERY long so they form *logical* pages
     * as well once they are broken up into ~1000px height units.
     */
    dimensions: IDimensions | null | undefined;

}

export namespace SparseDimensions {

    export function toSparse(dimension: IDimensions) {
        return `${dimension.width}x${dimension.height}`;
    }

    export function fromSparse(dimension: string) {
        const split = dimension.split('x');
        const width = parseInt(split[0]);
        const height = parseInt(split[1]);

        return {
            width,
            height
        };

    }

}

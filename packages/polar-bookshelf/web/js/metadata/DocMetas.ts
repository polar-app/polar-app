import {DocMeta} from 'polar-shared/src/metadata/DocMeta';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {DocInfos} from 'polar-shared/src/metadata/DocInfos';
import {AnnotationInfos} from 'polar-shared/src/metadata/AnnotationInfos';
import {Pagemarks} from './Pagemarks';
import {PageMetas} from './PageMetas';
import {forDict} from 'polar-shared/src/util/Functions';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Errors} from '../util/Errors';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {IPageMeta} from "polar-shared/src/metadata/IPageMeta";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {IComment} from 'polar-shared/src/metadata/IComment';
import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {UUIDs} from "polar-shared/src/metadata/UUIDs";
import {SparseDocMetas} from "./SparseDocMetas";
import {DocMetaSerializer} from "polar-shared/src/metadata/DocMetaSerializer";
import {MockDocMetas} from "./MockDocMetas";

export type AnnotationCallback = (pageMeta: IPageMeta,
                                  annotation: ITextHighlight | IAreaHighlight | IFlashcard | IComment,
                                  type: AnnotationType) => void;

export class DocMetas {

    public static ENABLE_SPARSE_DOC_SERIALIZE = true;

    public static annotations(docMeta: IDocMeta, callback: AnnotationCallback) {

        for (const pageMeta of Object.values(docMeta.pageMetas)) {

            for (const annotation of Object.values(pageMeta.textHighlights || {})) {
                callback(pageMeta, annotation, AnnotationType.TEXT_HIGHLIGHT);
            }

            for (const annotation of Object.values(pageMeta.areaHighlights || {})) {
                callback(pageMeta, annotation, AnnotationType.AREA_HIGHLIGHT);
            }

            for (const annotation of Object.values(pageMeta.flashcards || {})) {
                callback(pageMeta, annotation, AnnotationType.FLASHCARD);
            }

            for (const annotation of Object.values(pageMeta.comments || {})) {
                callback(pageMeta, annotation, AnnotationType.COMMENT);
            }

        }

    }

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     *
     * @param fingerprint The fingerprint of the document
     * @param nrPages The number of pages in this document.
     */
    public static create(fingerprint: string, nrPages: number, filename?: string) {

        return DocMetaSerializer.create(fingerprint, nrPages, filename)

    }

    // let result: IDocInfo = Object.create(DocInfos.prototype);
    //
    // result.fingerprint = fingerprint;
    // result.nrPages = nrPages;
    // result.init(result);

    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     *
     * @deprecated use MockDocMetas
     */
    public static createWithinInitialPagemarks(fingerprint: string, nrPages: number) {
        return MockDocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
    }

    /**
     * @deprecated use MockDocMetas
     */
    public static createMockDocMeta() {
        return MockDocMetas.createMockDocMeta();
    }

    public static getPageMeta(docMeta: IDocMeta, num: number) {

        Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions.assertPresent(num, "num");

        const pageMeta = docMeta.pageMetas[num];

        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }

        return pageMeta;

    }

    public static addPagemarks(docMeta: IDocMeta, options: any) {

        if (!options) {
            options = {};
        }

        if (!options.nrPages) {
            options.nrPages = 3;
        }

        if (!options.offsetPage) {
            // the starting page
            options.offsetPage = 1;
        }

        if (!options.percentage) {
            // the percentage value from 0-100
            options.percentage = 100;
        }

        const maxPageNum = Math.min(options.offsetPage + options.nrPages - 1, docMeta.docInfo.nrPages);

        for (let pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum ) {

            const pagemark = Pagemarks.create({
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            Pagemarks.updatePagemark(docMeta, pageNum, pagemark);

        }

    }

    public static serialize(docMeta: IDocMeta, spacing: string = "  ") {

        if (this.ENABLE_SPARSE_DOC_SERIALIZE) {
            const data = SparseDocMetas.toSparse(docMeta);
            return JSON.stringify(data, null, spacing);
        } else {
            return JSON.stringify(docMeta, null, spacing);
        }

    }

    /**
     */
    public static deserialize(data: string, fingerprint: string): IDocMeta {

        Preconditions.assertPresent(data, 'data');

        if (typeof data !== "string") {
            throw new Error("We can only deserialize strings: " + typeof data);
        }

        const docMeta: IDocMeta = Object.create(DocMeta.prototype);

        try {

            let obj = JSON.parse(data);

            if (SparseDocMetas.isSparse(obj)) {
                obj = SparseDocMetas.fromSparse(obj);
            }

            Object.assign(docMeta, obj);

            if (docMeta.docInfo && !docMeta.docInfo.filename) {
                // log.warn("DocMeta has no filename: " + docMeta.docInfo.fingerprint);
            }

            return DocMetas.upgrade(docMeta);

        } catch (e) {
            throw Errors.rethrow(e, "Unable to deserialize doc: " + fingerprint);
        }

    }

    public static upgrade(docMeta: IDocMeta): IDocMeta {

        // validate the JSON data and set defaults. In the future we should
        // migrate to using something like AJV to provide these defaults and
        // also perform type assertion.

        docMeta.pageMetas = PageMetas.upgrade(docMeta.pageMetas);

        if (!docMeta.annotationInfo) {
            // log.debug("No annotation info.. Adding default.");
            docMeta.annotationInfo = AnnotationInfos.create();
        }

        if (!docMeta.attachments) {
            // log.debug("No attachments. Adding empty map.");
            docMeta.attachments = {};
        }

        docMeta.docInfo = DocInfos.upgrade(docMeta.docInfo);

        return docMeta;

    }

    /**
     * Compute the progress of a document based on the pagemarks.
     */
    public static computeProgress(docMeta: IDocMeta): number {

        let total = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (column, pagemark) => {

                total += pagemark.percentage;

            });

        });

        return total / (docMeta.docInfo.nrPages * 100);

    }

    /**
     * Make changes to the document so that they write as one batched mutation
     * at the end.
     *
     * @param docMeta The doc to mutate
     *
     * @param mutator  The function to execute which will mutation the
     * underlying DocMeta properly.
     */
    public static withBatchedMutations<T>(docMeta: IDocMeta, mutator: () => T) {
        return this.withMutating(docMeta, 'batch', mutator);
    }

    public static withSkippedMutations<T>(docMeta: IDocMeta, mutator: () => T) {
        return this.withMutating(docMeta, 'skip', mutator);
    }

    private static withMutating<T>(docMeta: IDocMeta,
                                   value: 'skip' | 'batch',
                                   mutator: () => T) {

        if (docMeta.docInfo.mutating === value) {
            // we were called twice so don't reset itself in the finally block
            // below to trigger too many updates. Just mutate directly.
            return mutator();
        }

        try {

            docMeta.docInfo.mutating = value;

            return mutator();

        } finally {
            // set it to undefined so that it isn't actually persisted in the
            // resulting JSON
            docMeta.docInfo.mutating = undefined;
        }

    }

    /**
     * Force a write of the DocMeta
     */
    public static forceWrite(docMeta: IDocMeta) {
        docMeta.docInfo.lastUpdated = ISODateTimeStrings.create();
    }
    /**
     * Create a copy of the DocMeta and with updated lastUpdate fields and
     * a new UUID.
     */
    public static updated(docMeta: IDocMeta): IDocMeta {

        docMeta = Dictionaries.copyOf(docMeta);

        docMeta.docInfo.lastUpdated = ISODateTimeStrings.create();
        docMeta.docInfo.uuid = UUIDs.create();

        const docInfo = Dictionaries.copyOf(docMeta.docInfo);
        return Object.assign(new DocMeta(docInfo, {}), docMeta);

    }

    public static copyOf(docMeta: IDocMeta): IDocMeta {
        return DocMetaSerializer.copyOf(docMeta);
    }

}

export interface MockDoc {
    readonly docMeta: IDocMeta;
    readonly fileRef: FileRef;
}

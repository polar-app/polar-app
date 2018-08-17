import {PageMeta} from './PageMeta';
import {Logger} from '../logger/Logger';
import {DocMeta} from './DocMeta';
import {PagemarkType} from './PagemarkType';
import {PageInfo} from './PageInfo';
import {DocInfos} from './DocInfos';
import {AnnotationInfos} from './AnnotationInfos';

const {Pagemarks} = require("./Pagemarks");
const {MetadataSerializer} = require("./MetadataSerializer");
const {PageMetas} = require("./PageMetas");
const {TextHighlights} = require("./TextHighlights");

const log = Logger.create();

export class DocMetas {

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     * @param fingerprint The fingerprint of the document
     * @param nrPages The number of pages in this document.
     */
    static create(fingerprint: string, nrPages: number) {

        let docInfo = DocInfos.create(fingerprint, nrPages);

        let pageMetas: {[id: string]: PageMeta} = {};

        for(let idx = 1; idx <= nrPages; ++idx) {
            let pageInfo = new PageInfo({num: idx});
            let pageMeta = new PageMeta({pageInfo: pageInfo});
            pageMetas[idx] = pageMeta;
        }

        return new DocMeta(docInfo, pageMetas);

    }

    // let result: DocInfo = Object.create(DocInfos.prototype);
    //
    // result.fingerprint = fingerprint;
    // result.nrPages = nrPages;
    // result.init(result);



    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     * @deprecated use MockDocMetas
     */
    static createWithinInitialPagemarks(fingerprint: string, nrPages: number) {
        return MockDocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
    }

    /**
     * @deprecated use MockDocMetas
     */
    static createMockDocMeta() {
        return MockDocMetas.createMockDocMeta();
    }

    /**
     */
    static addPagemarks(docMeta: DocMeta, options: any) {

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

        let maxPageNum = Math.min(options.offsetPage + options.nrPages -1, docMeta.docInfo.nrPages);

        for(let pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum ) {

            let pagemark = Pagemarks.create({
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            let pageMeta = docMeta.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

    }

    static serialize(docMeta: DocMeta, spacing: string) {
        return MetadataSerializer.serialize(docMeta, spacing);
    }

    /**
     * @return {DocMeta}
     */
    static deserialize(data: any) {

        if(! (typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }

        let docMeta: DocMeta = Object.create(DocMeta.prototype);

        docMeta = MetadataSerializer.deserialize(docMeta, data);

        return DocMetas.upgrade(docMeta);

    }

    /**
     *
     * @param docMeta {DocMeta}
     * @return {DocMeta}
     */
    static upgrade(docMeta: DocMeta) {

        // validate the JSON data and set defaults. In the future we should migrate
        // to using something like AJV to provide these defaults and also perform
        // type assertion.

        docMeta.pageMetas = PageMetas.upgrade(docMeta.pageMetas);

        // TODO: go through and upgrade the pagemarks. I should probably have
        // an upgrade function for each object type...

        if(!docMeta.annotationInfo) {
            log.warn("No annotation info.. Adding default.");
            docMeta.annotationInfo = AnnotationInfos.create();
        }

        if(docMeta.docInfo) {

            if(!docMeta.docInfo.pagemarkType) {
                log.warn("DocInfo has no pagemarkType... Adding default of SINGLE_COLUMN")
                docMeta.docInfo.pagemarkType = PagemarkType.SINGLE_COLUMN;
            }

        }

        return docMeta;

    }

}

export class MockDocMetas {


    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     *
     */
    static createWithinInitialPagemarks(fingerprint: string, nrPages: number) {

        let result = DocMetas.create(fingerprint, nrPages);

        let maxPages = 3;
        for(let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum ) {

            let pagemark = Pagemarks.create({
                                                type: PagemarkType.SINGLE_COLUMN,
                                                percentage: 100,
                                                column: 0
                                            });

            let pageMeta = result.getPageMeta(pageNum);

            // set the pagemark that we just created.
            // TODO: this should be pagemark.id as the key not pagemark.column
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

        return result;

    }

    static createMockDocMeta() {

        let fingerprint = "0x001";
        let nrPages = 4;
        let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

        let textHighlight = TextHighlights.createMockTextHighlight();

        docMeta.getPageMeta(1).textHighlights[textHighlight.id] = textHighlight;

        return docMeta;

    }

}

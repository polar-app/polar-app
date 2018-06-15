const {Pagemarks} = require("./Pagemarks");
const {Pagemark} = require("./Pagemark");
const {DocMeta} = require("./DocMeta");
const {DocInfo} = require("./DocInfo");
const {PageInfo} = require("./PageInfo");
const {PageMeta} = require("./PageMeta");
const {PagemarkType} = require("./PagemarkType");
const {ISODateTime} = require("./ISODateTime");
const {AnnotationInfo} = require("./AnnotationInfo");
const {MetadataSerializer} = require("./MetadataSerializer");
const {TextHighlightRecords} = require("./TextHighlightRecords");
const {forDict} = require("../utils");

class DocMetas {

    /**
     * Create the basic DocInfo structure that we can use with required / basic
     * field structure.
     * @param fingerprint The fingerprint
     * @param nrPages The number of pages in this document.
     * @returns {DocMeta}
     */
    static create(fingerprint, nrPages) {

        let docInfo = new DocInfo({fingerprint, nrPages});

        let pageMetas = {};

        for(let idx = 1; idx <= nrPages; ++idx) {
            let pageInfo = new PageInfo({num: idx});
            let pageMeta = new PageMeta({pageInfo: pageInfo});
            pageMetas[idx] = pageMeta;
        }

        return new DocMeta({docInfo, pageMetas});

    }

    /**
     * Create a DocMeta object but place initial pagemarks on it. This is useful
     * for testing.
     */
    static createWithinInitialPagemarks(fingerprint, nrPages) {

        let result = this.create(fingerprint, nrPages);

        let maxPages = 3;
        for(let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum ) {

            let pagemark = Pagemarks.create({
                type: PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });

            let pageMeta = result.getPageMeta(pageNum);

            // set the pagemark that we just created.
            pageMeta.pagemarks[pagemark.column] = pagemark;

        }

        return result;

    }

    /**
     */
    static addPagemarks(docMeta, options) {

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

    static serialize(docMeta, spacing) {
        return MetadataSerializer.serialize(docMeta, spacing);
    }

    static deserialize(data) {

        if(! (typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }

        let docMeta = MetadataSerializer.deserialize(new DocMeta(), data);

        return DocMetas.upgrade(docMeta);

    }

    static upgrade(docMeta) {

        // validate the JSON data and set defaults. In the future we should migrate
        // to using something like AJV to provide these defaults and also perform
        // type assertion.

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                console.warn("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, function (key, textHighlight) {
                if(! textHighlight.id) {
                    console.warn("Text highlight given ID");
                    textHighlight.id = TextHighlightRecords.createID(textHighlight.rects);
                }
            });

            if(!pageMeta.areaHighlights) {
                console.warn("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if(!pageMeta.pagemarks) {
                console.warn("No pagemarks.  Assigning default.");
                pageMeta.pagemarks = {};
            }

            forDict(pageMeta.pagemarks, function (key, pagemark) {
                if(! pagemark.id) {
                    console.warn("Pagemark given ID");
                    pagemark.id = Pagemarks.createID(pagemark.created);
                }
            });

        } );

        if(!docMeta.annotationInfo) {
            console.log("No annotation info.. Adding default.")
            docMeta.annotationInfo = new AnnotationInfo();
        }

        return docMeta;

    }

}

module.exports.DocMetas = DocMetas;

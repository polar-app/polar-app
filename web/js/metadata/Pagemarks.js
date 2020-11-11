"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagemarks = void 0;
const PagemarkRect_1 = require("./PagemarkRect");
const Pagemark_1 = require("./Pagemark");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
const PagemarkRects_1 = require("./PagemarkRects");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const PagemarkMode_1 = require("polar-shared/src/metadata/PagemarkMode");
const DocMetas_1 = require("./DocMetas");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const ReadingProgresses_1 = require("./ReadingProgresses");
const HitMap_1 = require("polar-shared/src/util/HitMap");
const ReadingOverviews_1 = require("./ReadingOverviews");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const Objects_1 = require("polar-shared/src/util/Objects");
const log = Logger_1.Logger.create();
const DEFAULT_PAGEMARK_RECT = new PagemarkRect_1.PagemarkRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});
class Pagemarks {
    static createID(created) {
        return Hashcodes_1.Hashcodes.createID({ created, sequence: this.sequences.id++ });
    }
    static createExtender(docMeta) {
        return (extendPagemark) => {
            Pagemarks.updatePagemarksForRange(docMeta, extendPagemark.page, 100, { start: extendPagemark.origin });
        };
    }
    static updatePagemarksForRange(docMeta, end, percentage = 100, opts = {}) {
        if (end < 1) {
            throw new Error("Page number must be 1 or more");
        }
        const created = ISODateTimeStrings_1.ISODateTimeStrings.create();
        const batch = opts.batch || Hashcodes_1.Hashcodes.createID({ created, id: this.sequences.batch++ });
        const calculateStartPage = () => {
            const range = [...Numbers_1.Numbers.range(1, Math.max(1, end - 1))].reverse();
            for (const r of range) {
                const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, r);
                if (Dictionaries_1.Dictionaries.size(pageMeta.pagemarks || {}) !== 0) {
                    return r;
                }
            }
            return 1;
        };
        const createPagemarkRect = (pageNum, percentage = 100) => {
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            const pagemarks = Object.values(pageMeta.pagemarks || {});
            if (pagemarks.length === 0) {
                return PagemarkRects_1.PagemarkRects.createFromRect({
                    left: 0,
                    top: 0,
                    height: percentage,
                    width: 100
                });
            }
            let top = 0;
            for (const pagemark of pagemarks) {
                const newTop = pagemark.rect.top + pagemark.rect.height;
                if (newTop > top) {
                    top = newTop;
                }
            }
            const coverage = pagemarks.map(pagemark => pagemark.percentage)
                .reduce(Reducers_1.Reducers.SUM, 0);
            if (Math.floor(coverage) === 100 || top === 100) {
                return undefined;
            }
            return PagemarkRects_1.PagemarkRects.createFromRect({
                left: 0,
                top,
                height: 100 - top,
                width: 100
            });
        };
        const start = opts.start || calculateStartPage();
        const result = [];
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            for (const pageNum of Numbers_1.Numbers.range(start, end)) {
                const rectPercentage = pageNum === end ? percentage : 100;
                const rect = createPagemarkRect(pageNum, rectPercentage);
                if (rect) {
                    const pagemark = Pagemarks.create({ created, rect, batch });
                    Pagemarks.updatePagemark(docMeta, pageNum, pagemark);
                    result.push({ pageNum, pagemark });
                }
            }
        });
        return result;
    }
    static create(opts = {}) {
        const options = Objects_1.Objects.defaults(opts, {
            type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
            column: 0,
        });
        const keyOptions = Pagemarks.createKeyOptions(options);
        if (keyOptions.count === 0) {
            throw new Error("Must specify either rect or percentage.");
        }
        if (keyOptions.count === 1) {
            if (keyOptions.hasPercentage) {
                keyOptions.rect = PagemarkRects_1.PagemarkRects.createFromPercentage(keyOptions.percentage);
            }
            if (keyOptions.hasRect) {
                keyOptions.percentage = keyOptions.rect.toPercentage();
            }
        }
        if (Percentages_1.round(keyOptions.percentage) !== Percentages_1.round(keyOptions.rect.toPercentage())) {
            const msg = "Percentage and rect are not the same";
            log.warn(msg, keyOptions.percentage, keyOptions.rect, keyOptions.rect.toPercentage());
            throw new Error(msg);
        }
        const created = options.created || ISODateTimeStrings_1.ISODateTimeStrings.create();
        const batch = options.batch || Hashcodes_1.Hashcodes.createID({ created, id: this.sequences.batch++ });
        const mode = options.mode || PagemarkMode_1.PagemarkMode.READ;
        const id = Pagemarks.createID(created);
        return new Pagemark_1.Pagemark({
            id,
            guid: id,
            created,
            type: options.type,
            percentage: Numbers_1.Numbers.toFixedFloat(keyOptions.percentage, 10),
            column: options.column,
            rect: keyOptions.rect,
            batch,
            mode
        });
    }
    static createKeyOptions(options) {
        const keyOptions = {
            count: 0,
            hasPercentage: false,
            hasRect: false,
            rect: options.rect,
            percentage: options.percentage
        };
        keyOptions.hasPercentage = "percentage" in options;
        keyOptions.hasRect = "rect" in options;
        if (keyOptions.hasPercentage) {
            ++keyOptions.count;
        }
        if (keyOptions.hasRect) {
            ++keyOptions.count;
        }
        return keyOptions;
    }
    static upgrade(pagemarks) {
        const result = {};
        Object.assign(result, pagemarks);
        Dictionaries_1.Dictionaries.forDict(result, (key, pagemark) => {
            if (!pagemark.rect) {
                if (pagemark.percentage >= 0 && pagemark.percentage <= 100) {
                    pagemark.rect = PagemarkRects_1.PagemarkRects.createFromPercentage(pagemark.percentage);
                }
            }
            if (Math.floor(pagemark.rect.top) === 100) {
                delete result[key];
                return;
            }
            if (!pagemark.id) {
                pagemark.id = key;
            }
            if (!pagemark.mode) {
                pagemark.mode = PagemarkMode_1.PagemarkMode.READ;
            }
            if (!Preconditions_1.isPresent(pagemark.percentage)) {
                pagemark.percentage = 0;
            }
        });
        return result;
    }
    static updatePagemark(docMeta, pageNum, pagemark) {
        pagemark.lastUpdated = ISODateTimeStrings_1.ISODateTimeStrings.create();
        this.doDocMetaMutation(docMeta, pageNum, () => {
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            this.doPageMetaMutation(pageMeta, () => {
                pageMeta.pagemarks[pagemark.id] = pagemark;
            });
        });
    }
    static replacePagemark(docMeta, pagemarkPtr, options) {
        const pagemarksToMutate = () => {
            const result = [];
            if (pagemarkPtr.ref) {
                const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pagemarkPtr.ref.pageNum);
                result.push({ pageMeta, id: pagemarkPtr.ref.pagemark.id });
            }
            if (pagemarkPtr.batch) {
                result.push(...this.pagemarksWithinBatch(docMeta, pagemarkPtr.batch));
            }
            return result;
        };
        const pagemarkRefs = pagemarksToMutate();
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            for (const ref of pagemarkRefs) {
                const currPagemark = ref.pageMeta.pagemarks[ref.id];
                const newPagemark = new Pagemark_1.Pagemark(currPagemark);
                if (options.mode) {
                    newPagemark.mode = options.mode;
                }
                this.doPageMetaMutation(ref.pageMeta, () => {
                    ref.pageMeta.pagemarks[ref.id] = newPagemark;
                });
            }
        });
    }
    static deletePagemark(docMeta, pageNum, id) {
        this.doDocMetaMutation(docMeta, pageNum, () => {
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            let pageMetaMutator;
            if (id) {
                const primaryPagemark = pageMeta.pagemarks[id];
                if (primaryPagemark) {
                    if (primaryPagemark.batch) {
                        const pagemarksWithinBatch = this.pagemarksWithinBatch(docMeta, primaryPagemark.batch);
                        pageMetaMutator = () => {
                            for (const pagemarkRef of pagemarksWithinBatch) {
                                delete pagemarkRef.pageMeta.pagemarks[pagemarkRef.id];
                            }
                        };
                    }
                    else {
                        pageMetaMutator = () => delete pageMeta.pagemarks[id];
                    }
                }
                else {
                    log.warn(`No pagemark found for id ${id} for pageNum ${pageNum}`);
                }
            }
            else {
                pageMetaMutator = () => Objects_1.Objects.clear(pageMeta.pagemarks);
            }
            this.doPageMetaMutation(pageMeta, pageMetaMutator);
        });
    }
    static pagemarksWithinBatch(docMeta, batch) {
        const result = [];
        const nrPages = Object.keys(docMeta.pageMetas).length;
        for (let pageIdx = 1; pageIdx <= nrPages; ++pageIdx) {
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageIdx);
            for (const pagemark of Object.values(pageMeta.pagemarks || {})) {
                if (pagemark.batch === batch) {
                    result.push({ pageMeta, id: pagemark.id });
                }
            }
        }
        return result;
    }
    static doDocMetaMutation(docMeta, pageNum, pagemarkMutator) {
        Preconditions_1.Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions_1.Preconditions.assertPresent(pageNum, "pageNum");
        DocMetas_1.DocMetas.withBatchedMutations(docMeta, () => {
            pagemarkMutator();
            const progress = Math.floor(DocMetas_1.DocMetas.computeProgress(docMeta) * 100);
            docMeta.docInfo.progress = progress;
            docMeta.docInfo.readingPerDay
                = ReadingOverviews_1.ReadingOverviews.compute(Object.values(docMeta.pageMetas));
        });
    }
    static doPageMetaMutation(pageMeta, pageMetaMutator) {
        if (!pageMetaMutator) {
            return;
        }
        const createProgressByMode = () => {
            const result = new HitMap_1.HitMap();
            for (const pagemark of Object.values(pageMeta.pagemarks)) {
                const mode = pagemark.mode || PagemarkMode_1.PagemarkMode.READ;
                result.registerHit(mode, pagemark.percentage);
            }
            return result.toLiteralMap();
        };
        const writeReadingProgress = (preExisting) => {
            const percentages = Object.values(pageMeta.pagemarks)
                .map(current => current.percentage);
            const progress = Percentages_1.Percentages.sum(...percentages);
            const progressByMode = createProgressByMode();
            const readingProgress = ReadingProgresses_1.ReadingProgresses.create(progress, progressByMode, preExisting);
            pageMeta.readingProgress[readingProgress.id] = readingProgress;
        };
        const doPreExisting = Dictionaries_1.Dictionaries.empty(pageMeta.readingProgress) && !Dictionaries_1.Dictionaries.empty(pageMeta.pagemarks);
        if (doPreExisting) {
            writeReadingProgress(true);
        }
        pageMetaMutator();
        writeReadingProgress();
    }
    static computeReadingProgressStats(docMetaProviders) {
        for (const docMetaProvider of docMetaProviders) {
            const docMeta = docMetaProvider();
        }
    }
}
exports.Pagemarks = Pagemarks;
Pagemarks.sequences = {
    id: 0,
    batch: 0
};
//# sourceMappingURL=Pagemarks.js.map
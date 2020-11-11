"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadExampleDocs = void 0;
const AppPath_1 = require("../../../electron/app_path/AppPath");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const DocImporter_1 = require("../importers/DocImporter");
const Pagemarks_1 = require("../../../metadata/Pagemarks");
const Logger_1 = require("polar-shared/src/logger/Logger");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const DocMetas_1 = require("../../../metadata/DocMetas");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const LoadExampleDocsMeta_1 = require("./LoadExampleDocsMeta");
const Hashcode_1 = require("polar-shared/src/metadata/Hashcode");
const BackendFileRefs_1 = require("../../../datastore/BackendFileRefs");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const log = Logger_1.Logger.create();
class LoadExampleDocs {
    constructor(persistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }
    load(onLoaded) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasDocs()) {
                log.debug("Docs already exist");
                return;
            }
            const promises = [
                this.doDoc0(),
                this.doDoc1(),
                this.doDoc2(),
                this.doDoc3(),
                this.doDoc4(),
                this.doDoc5(),
                this.doDoc6(),
                this.doDoc7()
            ];
            for (const promise of promises) {
                promise
                    .then(docMeta => {
                    if (docMeta) {
                        onLoaded(docMeta.docInfo);
                    }
                    else {
                        log.warn("Unable to load docMeta");
                    }
                }).catch(err => log.error("Unable to load docInfo: ", err));
            }
            yield Promise.all(promises);
        });
    }
    doDoc7() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'dremel.pdf'), {
                fingerprint: "69cf32b9ffbb82056a3ac0eadea447de",
                title: "Dremel: Interactive Analysis of Web-Scale Datasets",
                tags: this.createTags('google', 'dremel', '/technology/google'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-8h'),
                pagemarkEnd: 1,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/dremel.pdf",
                nrPages: 10,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "13e69EGrqZdoaAcKdzECCYwVkEAZ3HVsjh9UNccSjEcmTNCSRz"
                }
            });
        });
    }
    doDoc6() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'datacenter-as-a-computer.pdf'), {
                fingerprint: "a81fe1c43148c3448e1a4133a5c8005e",
                title: "The Datacenter as a Computer",
                tags: this.createTags('google', 'datacenters', '/technology/google'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-8h'),
                pagemarkEnd: 2,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/datacenter-as-a-computer.pdf",
                nrPages: 120,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "12gk1XzeM8rCLbSmPnHSNYqWPkJ4V4LQW7WLo1MFJfGJMQVVQzU"
                }
            });
        });
    }
    doDoc5() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'chubby.pdf'), {
                fingerprint: "c29bc1717788b1602a3cf4ed28ddfbcd",
                title: "The Chubby lock service for loosely-coupled distributed systems",
                tags: this.createTags('google', 'chubby', '/technology/google'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-1d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-3h'),
                pagemarkEnd: 2,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/chubby.pdf",
                nrPages: 16,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "12dVEYTS8znhWJNCYUcGHSfWKQqfifBmbShRLxbLvNVYX5BK3sS"
                }
            });
        });
    }
    doDoc4() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'borg.pdf'), {
                fingerprint: "3417be32534083dea66d733604d36d75",
                title: "Large-scale cluster management at Google with Borg",
                tags: this.createTags('google', 'borg', 'docker', '/technology/docker'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-3d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-8h'),
                pagemarkEnd: 2,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/borg.pdf",
                nrPages: 17,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "19YRZoEqfbhmY2GqQVKcbjfgbm1hZc5TwKdfUo3QW3TVz126bH"
                }
            });
        });
    }
    doDoc3() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'availability.pdf'), {
                fingerprint: "39b730b6e9d281b0eae91b2c2c29b842",
                title: "Availability in Globally Distributed Storage Systems",
                tags: this.createTags('google', 'availability', '/technology/google'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-12h'),
                pagemarkEnd: 7,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/availability.pdf",
                nrPages: 14,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT"
                }
            });
        });
    }
    createTag(id, label) {
        return { id, label: label || id };
    }
    createTags(...labels) {
        const result = {};
        for (const label of labels) {
            const id = label;
            result[id] = { id, label };
        }
        return result;
    }
    doDoc0() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'pub47492.pdf'), {
                fingerprint: "6ea16525b2e4eab7b946f68419a345a6",
                title: "Efficient Live Expansion for Clos Data Center Networks",
                tags: this.createTags('google', 'datacenters', '/technology/networks', '/technology/datacenters'),
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2h'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-1h'),
                pagemarkEnd: 17,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/pub47492.pdf",
                nrPages: 20,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "1h62ktMPhAXXYgnFaDckCht164co4HcDR24WXu8xsvXV2RB1HA"
                }
            });
        });
    }
    doDoc1() {
        return __awaiter(this, void 0, void 0, function* () {
            const writtenDocMeta = yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'bigtable.pdf'), {
                fingerprint: "a2887850877ae33e1e66ea24f433e30f",
                title: "Bigtable: A Distributed Storage System for Structured Data",
                tags: {
                    google: this.createTag('google'),
                    bigtable: this.createTag('bigtable'),
                    compsci: this.createTag('compsci')
                },
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-1d'),
                flagged: true,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/bigtable.pdf",
                nrPages: 14,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "1ag3DiKsWirunzx8s81iUL988AefnKouGa2DN2TMZxdZj9yZ4F"
                }
            });
            if (writtenDocMeta) {
                const docMeta = DocMetas_1.DocMetas.deserialize(JSON.stringify(LoadExampleDocsMeta_1.LoadExampleDocsMeta.BIGTABLE_DOC_META), writtenDocMeta.docInfo.fingerprint);
                docMeta.docInfo = writtenDocMeta.docInfo;
                yield this.persistenceLayer.writeDocMeta(docMeta);
                return docMeta;
            }
            else {
                return undefined;
            }
        });
    }
    doDoc2() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.doDoc(FilePaths_1.FilePaths.join('docs', 'examples', 'pdf', 'mapreduce.pdf'), {
                fingerprint: "9012f59fe537f2bb5fb802e31bb40e83",
                title: "MapReduce: Simplified Data Processing on Large Clusters",
                tags: {
                    google: this.createTag('google'),
                    mapreduce: this.createTag('mapreduce'),
                    compsci: this.createTag('compsci')
                },
                added: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-3d'),
                lastUpdated: ISODateTimeStrings_1.ISODateTimeStrings.adjust(ISODateTimeStrings_1.ISODateTimeStrings.create(), '-2d'),
                pagemarkEnd: 6,
                url: "https://storage.googleapis.com/polar-32b0f.appspot.com/public/mapreduce.pdf",
                nrPages: 13,
                hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: "12PBhYxGA587Ap4D59ac1hNRXtKcj1uyWi9t3hTuRTQofbQTr3q"
                }
            });
        });
    }
    doDoc(relativePath, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const doImport = () => __awaiter(this, void 0, void 0, function* () {
                if (AppRuntime_1.AppRuntime.isElectron()) {
                    const pdfMeta = {
                        fingerprint: opts.fingerprint,
                        nrPages: opts.nrPages,
                        props: {}
                    };
                    const importedFile = yield this.doImport(relativePath, pdfMeta);
                    if (importedFile) {
                        const docInfo = importedFile.docInfo;
                        const docMeta = yield this.persistenceLayer.getDocMeta(docInfo.fingerprint);
                        const backendFileRef = importedFile.backendFileRef;
                        return {
                            docMeta: docMeta,
                            backendFileRef: backendFileRef
                        };
                    }
                    else {
                        throw new Error("Unable to do local import");
                    }
                }
                else {
                    const docMeta = DocMetas_1.DocMetas.create(opts.fingerprint, opts.nrPages);
                    const ref = {
                        name: FilePaths_1.FilePaths.basename(opts.url),
                        hashcode: opts.hashcode
                    };
                    docMeta.docInfo.backend = Backend_1.Backend.PUBLIC;
                    docMeta.docInfo.filename = ref.name;
                    docMeta.docInfo.hashcode = ref.hashcode;
                    return {
                        docMeta,
                        backendFileRef: BackendFileRefs_1.BackendFileRefs.toBackendFileRef(docMeta)
                    };
                }
            });
            const importedDoc = yield doImport();
            const docMeta = importedDoc.docMeta;
            if (docMeta) {
                docMeta.docInfo.title = opts.title;
                const tags = Object.assign(Object.assign({}, (opts.tags || {})), this.createTags('example'));
                docMeta.docInfo.tags = tags;
                if (opts.pagemarkEnd) {
                    Pagemarks_1.Pagemarks.updatePagemarksForRange(docMeta, opts.pagemarkEnd);
                }
                if (opts.added) {
                    docMeta.docInfo.added = opts.added;
                }
                if (opts.lastUpdated) {
                    docMeta.docInfo.lastUpdated = opts.lastUpdated;
                }
                docMeta.docInfo.flagged
                    = Optional_1.Optional.of(opts.flagged).getOrElse(false);
                log.info("Wrote to persistenceLayer: ", opts.title);
                yield this.persistenceLayer.writeDocMeta(docMeta);
                const datastore = this.persistenceLayer.datastore;
                if (datastore.id === 'firebase') {
                }
            }
            return docMeta;
        });
    }
    doImport(relativePath, parsedDocMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const appPath = AppPath_1.AppPath.get();
            if (!appPath) {
                throw new Error("No appPath");
            }
            const path = FilePaths_1.FilePaths.join(appPath, relativePath);
            const basename = FilePaths_1.FilePaths.basename(relativePath);
            const persistenceLayerProvider = () => this.persistenceLayer;
            return yield DocImporter_1.DocImporter.importFile(persistenceLayerProvider, path, basename);
        });
    }
    hasDocs() {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaRefs = yield this.persistenceLayer.getDocMetaRefs();
            return docMetaRefs.length !== 0;
        });
    }
}
exports.LoadExampleDocs = LoadExampleDocs;
LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT = "a2887850877ae33e1e66ea24f433e30f";
//# sourceMappingURL=LoadExampleDocs.js.map
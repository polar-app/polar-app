"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DocMeta_1 = require("./metadata/DocMeta");
const { Proxies } = require("./proxies/Proxies");
const { Pagemarks } = require("./metadata/Pagemarks");
const { PagemarkType } = require("./metadata/PagemarkType");
const { DocMetas } = require("./metadata/DocMetas");
const { DocMetaDescriber } = require("./metadata/DocMetaDescriber");
const { Reactor } = require("./reactor/Reactor");
const { Objects } = require("./util/Objects");
const { Preconditions } = require("./Preconditions");
class Model {
    constructor(persistenceLayer) {
        this.docMeta = new DocMeta_1.DocMeta();
        this.persistenceLayer = persistenceLayer;
        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('createPagemark');
        this.reactor.registerEvent('erasePagemark');
        this.docMetaPromise = null;
    }
    documentLoaded(fingerprint, nrPages, currentPageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            this.docMetaPromise = this.persistenceLayer.getDocMeta(fingerprint);
            this.docMeta = yield this.docMetaPromise;
            if (this.docMeta == null) {
                console.warn("New document found. Creating initial DocMeta");
                this.docMeta = DocMetas.create(fingerprint, nrPages);
                yield this.persistenceLayer.sync(fingerprint, this.docMeta);
            }
            console.log("Description of doc loaded: " + DocMetaDescriber.describe(this.docMeta));
            console.log("Document loaded: ", this.docMeta);
            this.docMeta = Proxies.create(this.docMeta, function (traceEvent) {
                console.log("sync of persistence layer via deep trace... ");
                this.persistenceLayer.sync(this.docMeta.docInfo.fingerprint, this.docMeta);
                return true;
            }.bind(this));
            this.docMetaPromise = new Promise(function (resolve, reject) {
                resolve(this.docMeta);
            }.bind(this));
            let documentLoadedEvent = { fingerprint, nrPages, currentPageNumber, docMeta: this.docMeta };
            this.reactor.dispatchEvent('documentLoaded', documentLoadedEvent);
            return this.docMeta;
        });
    }
    registerListenerForDocumentLoaded(eventListener) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }
    createPagemark(pageNum, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!options.percentage) {
                options.percentage = 100;
            }
            console.log("Model sees createPagemark");
            this.assertPageNum(pageNum);
            let pagemark = Pagemarks.create({
                type: PagemarkType.SINGLE_COLUMN,
                percentage: options.percentage,
                column: 0
            });
            let docMeta = yield this.docMetaPromise;
            let pageMeta = docMeta.getPageMeta(pageNum);
            pageMeta.pagemarks[pagemark.id] = pagemark;
            this.reactor.dispatchEvent('createPagemark', { pageNum, pagemark });
        });
    }
    erasePagemark(pageNum) {
        Preconditions.assertNumber(pageNum, "pageNum");
        console.log("Model sees erasePagemark");
        this.assertPageNum(pageNum);
        if (this.docMeta) {
            let pageMeta = this.docMeta.getPageMeta(pageNum);
            Objects.clear(pageMeta.pagemarks);
            this.reactor.dispatchEvent('erasePagemark', { pageNum });
        }
    }
    assertPageNum(pageNum) {
        if (pageNum == null)
            throw new Error("Must specify page pageNum");
        if (pageNum <= 0) {
            throw new Error("Page numbers begin at 1");
        }
    }
    registerListenerForCreatePagemark(eventListener) {
        this.reactor.addEventListener('createPagemark', eventListener);
    }
    registerListenerForErasePagemark(eventListener) {
        this.reactor.addEventListener('erasePagemark', eventListener);
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map
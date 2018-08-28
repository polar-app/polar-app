"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../logger/Logger");
const Functions_1 = require("../../util/Functions");
const DocMetaDescriber_1 = require("../../metadata/DocMetaDescriber");
const DocMetas_1 = require("../../metadata/DocMetas");
const log = Logger_1.Logger.create();
class ProgressView {
    constructor(model) {
        this.model = model;
    }
    start() {
        log.info("Starting...");
        this.model.registerListenerForDocumentLoaded(documentLoadedEvent => {
            log.info("onDocumentLoaded");
            let docMeta = documentLoadedEvent.docMeta;
            Functions_1.forDict(docMeta.pageMetas, (key, pageMeta) => {
                pageMeta.pagemarks.addTraceListener(() => {
                    this.update();
                });
            });
        });
    }
    update() {
        let perc = DocMetas_1.DocMetas.computeProgress(this.model.docMeta);
        log.info("Percentage is now: " + perc);
        let progressElement = document.querySelector("#polar-progress progress");
        progressElement.value = perc;
        let description = DocMetaDescriber_1.DocMetaDescriber.describe(this.model.docMeta);
        let docOverview = document.querySelector("#polar-doc-overview");
        if (docOverview) {
            docOverview.textContent = description;
        }
    }
}
exports.ProgressView = ProgressView;
//# sourceMappingURL=ProgressView.js.map
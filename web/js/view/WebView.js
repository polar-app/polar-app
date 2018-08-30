"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const View_1 = require("./View");
const DocFormatFactory_1 = require("../docformat/DocFormatFactory");
const DocMetaDescriber_1 = require("../metadata/DocMetaDescriber");
const Functions_1 = require("../util/Functions");
class WebView extends View_1.View {
    constructor(model) {
        super(model);
        this.docFormat = DocFormatFactory_1.DocFormatFactory.getInstance();
    }
    start() {
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
        return this;
    }
    updateProgress() {
        let perc = this.computeProgress(this.model.docMeta);
        console.log("Percentage is now: " + perc);
        let progressElement = document.querySelector("#polar-progress progress");
        progressElement.value = perc;
        let description = DocMetaDescriber_1.DocMetaDescriber.describe(this.model.docMeta);
        let docOverview = document.querySelector("#polar-doc-overview");
        if (docOverview) {
            docOverview.textContent = description;
        }
    }
    computeProgress(docMeta) {
        let total = 0;
        Functions_1.forDict(docMeta.pageMetas, (key, pageMeta) => {
            Functions_1.forDict(pageMeta.pagemarks, (column, pagemark) => {
                total += pagemark.percentage;
            });
        });
        let perc = total / (docMeta.docInfo.nrPages * 100);
        return perc;
    }
    onDocumentLoaded() {
        console.log("WebView.onDocumentLoaded: ", this.model.docMeta);
        this.updateProgress();
    }
}
exports.WebView = WebView;
//# sourceMappingURL=WebView.js.map
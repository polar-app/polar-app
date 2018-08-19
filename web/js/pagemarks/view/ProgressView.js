const {DocMetaDescriber} = require("../../metadata/DocMetaDescriber");
const {forDict} = require("../../util/Functions");
const log = require("../../logger/Logger").create();

/**
 * Updates our progress as we read the doc.
 */
class ProgressView {

    // TODO: this should actually be PagemarkProgressView

    /**
     * @param model {Model}
     */
    constructor(model) {
        this.model = model;
    }

    start() {

        log.info("Starting...");

        this.model.registerListenerForDocumentLoaded(documentLoadedEvent => {

            log.info("onDocumentLoaded");

            let docMeta = documentLoadedEvent.docMeta;

            forDict(docMeta.pageMetas, (key, pageMeta) => {

                pageMeta.pagemarks.addTraceListener(traceEvent => {
                    this.update();
                });

            });

        });

    }

    update() {

        // TODO: this should listen directly to the model and the pagemarks
        // themselves.

        let perc = this.computeProgress(this.model.docMeta);

        log.info("Percentage is now: " + perc);

        document.querySelector("#polar-progress progress").value = perc;

        // now update the description of the doc at the bottom.

        let description = DocMetaDescriber.describe(this.model.docMeta);

        let docOverview = document.querySelector("#polar-doc-overview");

        if(docOverview) {
            docOverview.textContent = description;
        }

    }

    computeProgress(docMeta) {

        let total = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (column, pagemark) => {

                total += pagemark.percentage;

            });

        });

        return total / (docMeta.docInfo.nrPages * 100);

    }

}

module.exports.ProgressView = ProgressView;

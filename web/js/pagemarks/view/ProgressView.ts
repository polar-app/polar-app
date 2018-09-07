import {Model} from '../../model/Model';
import {Logger} from '../../logger/Logger';
import {forDict} from '../../util/Functions';
import {DocMetaDescriber} from '../../metadata/DocMetaDescriber';
import {DocMetas} from '../../metadata/DocMetas';

const log = Logger.create();

/**
 * Updates our progress as we read the doc.
 */
export class ProgressView {

    private readonly model: Model;

    constructor(model: Model) {
        this.model = model;
    }

    start() {

        log.info("Starting...");

        this.model.registerListenerForDocumentLoaded(documentLoadedEvent => {

            log.info("onDocumentLoaded");

            let docMeta = documentLoadedEvent.docMeta;

            forDict(docMeta.pageMetas, (key, pageMeta) => {

                pageMeta.pagemarks.addTraceListener(() => {
                    this.update();
                });

            });

        });

    }

    update() {

        // TODO: this should listen directly to the model and the pagemarks
        // themselves.

        let perc = DocMetas.computeProgress(this.model.docMeta);

        log.info("Percentage is now: " + perc);

        let progressElement = <HTMLProgressElement>document.querySelector("#polar-progress progress");
        progressElement.value = perc;

        // now update the description of the doc at the bottom.

        let description = DocMetaDescriber.describe(this.model.docMeta);

        let docOverview = document.querySelector("#polar-doc-overview");

        if(docOverview) {
            docOverview.textContent = description;
        }

    }

}

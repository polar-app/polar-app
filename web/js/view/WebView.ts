import {DocumentLoadedEvent, Model} from '../model/Model';
import {View} from './View';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocFormat} from '../docformat/DocFormat';
import {DocMetaDescriber} from '../metadata/DocMetaDescriber';
import {forDict} from '../util/Functions';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from '../logger/Logger';
import {ShareContentButtons} from '../apps/viewer/ShareContentButtons';
import {Visibility} from '../datastore/Datastore';
import {PrefsProvider} from '../datastore/Datastore';
import {Datastores} from '../datastore/Datastores';
import {Backend} from '../datastore/Backend';
import {ReadingProgressResume} from './ReadingProgressResume';
import {RendererAnalytics} from '../ga/RendererAnalytics';
import {SharingDatastores} from '../datastore/SharingDatastores';
import {PersistenceLayers} from '../datastore/PersistenceLayers';

const log = Logger.create();

export class WebView extends View {

    private readonly docFormat: DocFormat;

    private readonly prefsProvider: PrefsProvider;

    /**
     *
     */
    constructor(model: Model, prefsProvider: PrefsProvider) {
        super(model);

        this.prefsProvider = prefsProvider;
        this.docFormat = DocFormatFactory.getInstance();

    }

    public start() {

        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

        this.createTimer();

        return this;

    }

    private createTimer() {
        const documentLoadTimer = RendererAnalytics.createTimer('document', 'loaded');
        this.model.registerListenerForDocumentLoaded(event => documentLoadTimer.stop());
    }

    /**
     * @deprecated Moved to pagemark.ProgressView... remove this code.
     */
    public updateProgress() {

        // TODO: this should listen directly to the model and the pagemarks
        // themselves.

        const perc = this.computeProgress(this.model.docMeta);

        log.info("Percentage is now: " + perc);

        const headerElement = <HTMLElement> document.querySelector("#polar-header");

        if (headerElement) {
            headerElement.style.display = 'block';
        }

        const progressElement = <HTMLProgressElement> document.querySelector("#polar-progress progress");

        progressElement.value = perc;

        // now update the description of the doc at the bottom.

        const description = DocMetaDescriber.describe(this.model.docMeta);

        const docOverview = document.querySelector("#polar-doc-overview");

        if (docOverview) {
            docOverview.textContent = description;
        }

    }

    /**
     * @deprecated Moved to pagemark.ProgressView... remove this code.
     */
    private computeProgress(docMeta: DocMeta) {

        // I think this is an issue of being async maybel?

        let total = 0;

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            forDict(pageMeta.pagemarks, (column, pagemark) => {

                total += pagemark.percentage;

            });

        });

        const perc = total / (docMeta.docInfo.nrPages * 100);

        return perc;
    }

    /**
     * Setup a document once we detect that a new one has been loaded.
     */
    private onDocumentLoaded(event: DocumentLoadedEvent) {

        const autoResume
            = this.prefsProvider.get().isMarked('settings-auto-resume', true);

        const docMeta = event.docMeta;

        log.info("WebView.onDocumentLoaded: ", docMeta);

        this.updateProgress();
        this.handleProgressDoubleClick(docMeta);

        if (autoResume) {
            ReadingProgressResume.resume(docMeta);
        }

        this.handleSharing(docMeta);

    }

    private handleSharing(docMeta: DocMeta) {

        const persistenceLayer = this.model.persistenceLayerProvider();

        const onVisibilityChanged = async (visibility: Visibility) => {

            try {
                log.info("Changing document visibility changed to: ", visibility);
                return await PersistenceLayers.changeVisibility(persistenceLayer, docMeta, visibility);
            } finally {
                log.info("Document visibility changed to: ", visibility);
            }

        };

        const datastoreCapabilities = persistenceLayer.capabilities();

        // TODO: use a latch for this though and only fetch it ONCE because it
        // takes about 1s but it never changes for the user.

        const createShareLink = async (): Promise<string | undefined> => {

            if (! datastoreCapabilities.networkLayers.has('web')) {
                return undefined;
            }

            return SharingDatastores.createURL(persistenceLayer, docMeta);

        };

        ShareContentButtons.create(docMeta.docInfo,
                                   datastoreCapabilities,
                                   createShareLink,
                                   onVisibilityChanged);

    }

    private handleProgressDoubleClick(docMeta: DocMeta) {

        document.querySelector("#polar-header")!.addEventListener('dblclick', () => {

            ReadingProgressResume.resume(docMeta);

        });

    }

}



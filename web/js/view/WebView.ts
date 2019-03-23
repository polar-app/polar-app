import {DocumentLoadedEvent, Model} from '../model/Model';
import {View} from './View';
import {DocFormatFactory} from '../docformat/DocFormatFactory';
import {DocFormat} from '../docformat/DocFormat';
import {DocMetaDescriber} from '../metadata/DocMetaDescriber';
import {forDict} from '../util/Functions';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from '../logger/Logger';
import {Arrays} from '../util/Arrays';
import {Elements} from '../util/Elements';
import {ReadingProgressResume} from './ReadingProgressResume';
import {LocalPrefs} from '../util/LocalPrefs';
import {Prefs} from '../util/prefs/Prefs';
import {PrefsProvider} from '../datastore/Datastore';
import {ShareContentButtons} from '../apps/viewer/ShareContentButtons';
import {NULL_FUNCTION} from '../util/Functions';
import {Visibility} from '../datastore/Datastore';

const log = Logger.create();

export class WebView extends View {

    private readonly docFormat: DocFormat;

    private readonly prefsProvider: PrefsProvider;

    /**
     *
     * @param model {Model}
     */
    constructor(model: Model, prefsProvider: PrefsProvider) {
        super(model);

        this.prefsProvider = prefsProvider;
        this.docFormat = DocFormatFactory.getInstance();

    }

    public start() {

        this.model.registerListenerForDocumentLoaded(event => this.onDocumentLoaded(event));

        return this;

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

        const onVisibilityChanged = (visibility: Visibility) => {
            docMeta.docInfo.visibility = visibility;
        };

        ShareContentButtons.create(docMeta.docInfo, onVisibilityChanged);

    }

    private handleProgressDoubleClick(docMeta: DocMeta) {

        document.querySelector("#polar-header")!.addEventListener('dblclick', () => {

            ReadingProgressResume.resume(docMeta);

        });

    }

}



import {DocMeta} from '../metadata/DocMeta';
import {ListenablePersistenceLayer} from '../datastore/ListenablePersistenceLayer';
import {Batcher} from '../datastore/batcher/Batcher';
import {TraceEvent} from '../proxies/TraceEvent';
import {Logger} from '../logger/Logger';
import {DocInfo} from '../metadata/DocInfo';
import {Proxies} from '../proxies/Proxies';

const log = Logger.create();

export class ModelPersister {

    public readonly docMeta: DocMeta;

    public nrWrites: number = 0;

    private readonly persistenceLayer: ListenablePersistenceLayer;

    constructor(persistenceLayer: ListenablePersistenceLayer, docMeta: DocMeta) {
        this.persistenceLayer = persistenceLayer;
        this.docMeta = docMeta;

        const batcher = new Batcher(async () => {

            await this.persistenceLayer.write(this.docMeta.docInfo.fingerprint, this.docMeta);
            ++this.nrWrites;

        });

        // create a new DocMeta proxy that updates on ANY update.
        this.docMeta = Proxies.create(this.docMeta, (traceEvent: TraceEvent) => {

            if (this.docMeta.docInfo.mutating) {
                // skip bulk updates. This is done when we need to mutate multiple
                // fields like setting 5-10 pagemarks at once or setting pagemarks
                // and other metrics metadata.
                return;
            }

            log.info(`sync of persistence layer at ${traceEvent.path} : ${traceEvent.property}"`);

            setTimeout(() => {

                batcher.enqueue().run()
                    .catch(err => log.error("Unable to commit to disk: ", err));

            }, 0);

            return true;

        });

        // only accept DocInfo updates from the document we've opened.
        this.persistenceLayer.addEventListenerForDoc(this.docMeta.docInfo.fingerprint, event => {

            log.debug("Received updated DocInfo.");

            if (this.docMeta.docInfo.fingerprint !== event.docInfo.fingerprint) {
                const detail = `${this.docMeta.docInfo.fingerprint} vs ${event.docInfo.fingerprint}`;
                throw new Error(`Attempt to update incorrect fingerprint: ` + detail);
            }

            this.docMeta.docInfo = new DocInfo(event.docInfo);

        });

    }

}

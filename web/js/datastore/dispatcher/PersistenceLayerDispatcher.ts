import {DocMeta} from '../../metadata/DocMeta';
import {IPCMessage} from '../../ipc/handler/IPCMessage';
import {DocMetaSync} from './DocMetaSync';
import {MetadataSerializer} from '../../metadata/MetadataSerializer';
import {Logger} from '../../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from '../DocMetaRef';
import {DeleteResult} from '../DiskDatastore';
import {IPersistenceLayer} from '../IPersistenceLayer';
import {Backend} from '../Backend';
import {FileMeta} from '../Datastore';
import {DatastoreFile} from '../DatastoreFile';
import {Optional} from '../../util/ts/Optional';

const log = Logger.create();

export class PersistenceLayerDispatcher implements IPersistenceLayerDispatcher, IPersistenceLayer {

    public readonly stashDir: string;

    public readonly logsDir: string;

    private readonly worker: Worker;

    /**
     * A PersistenceLayer for the non-dispatched methods (for now).
     */
    private readonly persistenceLayer: IPersistenceLayer;

    constructor(worker: Worker, persistenceLayer: IPersistenceLayer) {
        this.worker = worker;
        this.persistenceLayer = persistenceLayer;
        this.stashDir = this.persistenceLayer.stashDir;
        this.logsDir = this.persistenceLayer.logsDir;
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.persistenceLayer.contains(fingerprint);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.persistenceLayer.getDocMetaFiles();
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<DeleteResult> {
        return this.persistenceLayer.delete(docMetaFileRef);
    }

    public async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {
        return await this.persistenceLayer.getDocMeta(fingerprint);
    }

    public async init(): Promise<void> {
        return this.persistenceLayer.init();
    }

    public async syncDocMeta(docMeta: DocMeta): Promise<void> {
        return await this.sync(docMeta.docInfo.fingerprint, docMeta);
    }

    public async sync(fingerprint: string, docMeta: DocMeta) {

        log.info("Dispatching sync!");

        // these have to be deserialized and then re-serialized because they
        // have methods. Consider moving to IDocMeta and us interfaced everywhere
        // in our code so that we don't have to serialized and de-serialize
        // like this.  It's just a waste of CPU otherwise.

        let safeDocMeta: DocMeta = Object.create(DocMeta.prototype);

        safeDocMeta = MetadataSerializer.deserialize(safeDocMeta, MetadataSerializer.serialize(docMeta));

        const ipcMessage = new IPCMessage('sync', <DocMetaSync> {
            fingerprint, docMeta: safeDocMeta
        });

        this.worker.postMessage(ipcMessage);

    }

    public addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta): Promise<DatastoreFile> {
        return this.persistenceLayer.addFile(backend, name, data, meta);
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        return this.persistenceLayer.containsFile(backend, name);
    }

    public getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        return this.persistenceLayer.getFile(backend, name);
    }

}


// noinspection TsLint:no-empty-interface
export interface IPersistenceLayerDispatcher {

}

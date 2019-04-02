import {AbstractDatastore, Datastore, DatastoreID} from './Datastore';
import {WritableBinaryMetaDatastore} from './Datastore';
import {DocMetaSnapshotEventListener} from './Datastore';
import {DatastoreCapabilities} from './Datastore';
import {NetworkLayers} from './Datastore';
import {PrefsProvider} from './Datastore';
import {ErrorListener} from './Datastore';
import {DatastoreInitOpts} from './Datastore';
import {DatastoreOverview} from './Datastore';
import {SnapshotResult} from './Datastore';
import {InitResult} from './Datastore';
import {FileRef} from './Datastore';
import {DeleteResult} from './Datastore';
import {GetFileOpts} from './Datastore';
import {BinaryFileData} from './Datastore';
import {WriteFileOpts} from './Datastore';
import {BackendFileRef} from './Datastore';
import {BackendFileRefs} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {DocMetaFileRef} from './DocMetaRef';
import {IDocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Backend} from './Backend';
import {Optional} from '../util/ts/Optional';
import {DocFileMeta} from './DocFileMeta';
import {FirebaseDatastore} from './FirebaseDatastore';
import {DocMetas} from '../metadata/DocMetas';
import {DocMeta} from '../metadata/DocMeta';
import {Datastores} from './Datastores';

const log = Logger.create();

export class SharedDocumentDatastore extends AbstractDatastore implements Datastore, WritableBinaryMetaDatastore {

    public readonly id: DatastoreID;

    private readonly delegate = new FirebaseDatastore();

    private docMetaData: string | null = null;
    private docMeta: DocMeta | undefined;
    private docMetaRefs: DocMetaRef[] = [];
    private backendFileRefs: ReadonlyArray<BackendFileRef> = [];

    public constructor(private readonly docID: string,
                       private readonly fingerprint: string) {
        super();
        this.id = 'shared-document';
    }


    public async init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<InitResult> {

        opts = {...opts, noInitialSnapshot: true};

        await this.delegate.init(errorListener, opts);

        this.docMetaData = await this.delegate.getDocMetaDirectly(this.docID);

        if (this.docMetaData) {
            this.docMeta = DocMetas.deserialize(this.docMetaData!, this.fingerprint);
            this.docMetaRefs = [
                {
                    fingerprint: this.fingerprint,
                    docMeta: this.docMeta
                }
            ];

            this.backendFileRefs = Datastores.toBackendFileRefs(this.docMeta);

        }

        return {};

    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        //  noop
    }

    public capabilities(): DatastoreCapabilities {

        return {
            networkLayers: NetworkLayers.WEB
        };

    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.fingerprint === fingerprint;
    }

    public async deactivate(): Promise<void> {
        // noop
    }

    public getDocMeta(fingerprint: string): Promise<string | null> {
        throw this.docMeta;
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return this.docMetaRefs;
    }

    public getPrefs(): PrefsProvider {
        throw this.delegate.getPrefs();
    }

    public async overview(): Promise<DatastoreOverview | undefined> {
        return await this.delegate.overview();
    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult> {
        throw new Error("Not supported");
    }

    public async stop(): Promise<void> {
        // noop
    }

    public async write(fingerprint: string, data: any, docInfo: IDocInfo, datastoreMutation?: DatastoreMutation<boolean>): Promise<void> {
        throw new Error("Not supported");
    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        const backendFileRef: BackendFileRef = {backend, ...ref};

        return this.backendFileRefs.filter(current => BackendFileRefs.equals(current, backendFileRef)).length > 0;

    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>> {
        throw new Error("Not supported");
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        throw new Error("Not supported");
    }

    public async getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): Promise<Optional<DocFileMeta>> {
        throw new Error("Not implemented yet");
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        throw new Error("Not supported");
    }

    public async writeFileMeta(backend: Backend, ref: FileRef, docFileMeta: DocFileMeta): Promise<void> {
        throw new Error("Not supported");
    }

}



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
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {DocMetaFileRef} from './DocMetaRef';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';
import {IDocInfo} from '../metadata/DocInfo';
import {DatastoreMutation} from './DatastoreMutation';
import {Backend} from './Backend';
import {Optional} from '../util/ts/Optional';
import {DocFileMeta} from './DocFileMeta';

const log = Logger.create();

export class SharedDocumentDatastore extends AbstractDatastore implements Datastore, WritableBinaryMetaDatastore {

    public readonly id: DatastoreID;

    public constructor(private readonly docID: string,
                       private readonly fingerprint: string) {
        super();
        this.id = 'shared-document';
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
        throw new Error("Not implemented yet");
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        throw new Error("Not implemented yet");
    }

    public getPrefs(): PrefsProvider {
        throw new Error("Not implemented yet");
    }

    public async init(errorListener?: ErrorListener, opts?: DatastoreInitOpts): Promise<InitResult> {
        return {};
    }

    public async overview(): Promise<DatastoreOverview | undefined> {

        return {
            created: ISODateTimeStrings.create(),
            nrDocs: 1
        };

    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener, errorListener?: ErrorListener): Promise<SnapshotResult> {
        throw new Error("Not implemented yet");
    }

    public async stop(): Promise<void> {
        // noop
    }

    public async write(fingerprint: string, data: any, docInfo: IDocInfo, datastoreMutation?: DatastoreMutation<boolean>): Promise<void> {
        throw new Error("Not implemented");
    }

    public async containsFile(backend: Backend, ref: FileRef): Promise<boolean> {

        // TODO: from the docMeta on this item, get the binary files its hosting
        // into an array and see if it contains this one.

        throw new Error("Not implemented yet");
        //
        //
        // Datastores.toBackendFileRefs()
        //
        // return undefined;

    }

    public async delete(docMetaFileRef: DocMetaFileRef, datastoreMutation?: DatastoreMutation<boolean>): Promise<Readonly<DeleteResult>> {
        throw new Error("Not implemented");
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {
        throw new Error("Not implemented");
    }

    public async getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): Promise<Optional<DocFileMeta>> {
        throw new Error("Not implemented yet");
    }

    public async writeFile(backend: Backend, ref: FileRef, data: BinaryFileData, opts?: WriteFileOpts): Promise<DocFileMeta> {
        throw new Error("Not implemented");
    }

    public async writeFileMeta(backend: Backend, ref: FileRef, docFileMeta: DocFileMeta): Promise<void> {
        throw new Error("Not implemented");
    }

}



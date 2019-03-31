import {Datastore, DatastoreID, ErrorListener, InitResult} from './Datastore';
import {DocMetaRef} from './DocMetaRef';
import {Logger} from '../logger/Logger';
import {DiskDatastore} from './DiskDatastore';
import {RemoteDatastore} from './RemoteDatastore';

const log = Logger.create();

/**
 * A datastore which extends RemoteDatastore but adds support for local disk
 * operations for reads which are MUCH MUCH faster since we're not going through
 * IPC.  IPC is insanely slow.
 */
export class HybridRemoteDatastore extends RemoteDatastore {

    public readonly id: DatastoreID;

    private readonly diskDatastore: DiskDatastore;

    constructor(delegate: Datastore) {
        super(delegate);
        this.id = 'hybrid-remote:' + delegate.id;
        this.diskDatastore = new DiskDatastore();
    }

    public async init(errorListener?: ErrorListener): Promise<InitResult> {
        await super.init();
        await this.diskDatastore.init(errorListener);
        return {};
    }

    public async getDocMetaRefs(): Promise<DocMetaRef[]> {
        return await this.diskDatastore.getDocMetaRefs();
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return await this.diskDatastore.getDocMeta(fingerprint);
    }

}

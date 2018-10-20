import {Datastore, FileMeta} from './Datastore';
import {Directories} from './Directories';
import {Firebase} from '../firestore/Firebase';
import {Firestore} from '../firestore/Firestore';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {Hashcodes} from '../Hashcodes';
import {Preconditions} from '../Preconditions';
import {DocMetaHolder, RecordHolder, Visibility} from './FirebaseDatastore';

/**
 * A hybrid datastore allows us to have one datastore with a local and remote
 * datastore backing them.  Reads are resolved via the local data store and
 * writes are resolved to both the remote and local concurrently.
 *
 * The remote datastore is the source of truth.  There isn't a way to have
 * transactions setup between remote and local so what we do is always yield
 * the remote.  If we do a delete to remote, and then crash, then on startup,
 * the sync will remote the local (for example).
 *
 * The reverse is true too. If we startup and there is an excess file in the
 * remote, it's copied local.
 */
export class HybridDatastore implements Datastore {

    private readonly local: Datastore;

    private readonly remote: Datastore;

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    constructor(local: Datastore, remote: Datastore) {
        this.local = local;
        this.remote = remote;
        this.stashDir = local.stashDir;
        this.logsDir = local.logsDir;
        this.directories = local.directories;
    }

    public async init() {

        // FIXME: if we write a record, but we have a listener open, without
        // caching, where does that data come from?  I would prefer not to
        // re-send it from the server...

        await Promise.all([this.remote.init(), this.local.init()])
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        await this.remote.delete(docMetaFileRef);
        return this.local.delete(docMetaFileRef);
    }

    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }


    public async addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {

        await this.remote.addFile(backend, name, data, meta);

        // TODO: can't we just wait until the event is fired when it's pulled down
        // as part of the normal snapshot mechanism.?  That might be best as we
        // would be adding it twice.
        return this.local.addFile(backend, name, data, meta);

    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        return this.local.getFile(backend, name);
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        return this.local.containsFile(backend, name);
    }

    public async sync(fingerprint: string, data: string, docInfo: DocInfo) {

        // FIXME:

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        throw new Error("Not implemented");


    }

}

import {Datastore} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Preconditions} from '../Preconditions';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';

/**
 * A datastore that just forwards events to the given delegate.
 */
export class DelegatedDatastore implements Datastore {

    public readonly directories: Directories;

    public readonly logsDir: string;

    public readonly stashDir: string;

    public readonly filesDir: string;

    private readonly delegate: Datastore;

    constructor(delegate: Datastore) {
        Preconditions.assertPresent(delegate, 'delegate');
        this.delegate = delegate;
        this.directories = new Directories();
        this.logsDir = delegate.logsDir;
        this.stashDir = delegate.stashDir;
        this.filesDir = delegate.filesDir;

    }

    public contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        return this.delegate.delete(docMetaFileRef);
    }

    public addFile(backend: Backend, name: string, data: Buffer | string): Promise<DatastoreFile> {
        return this.delegate.addFile(backend, name, data);
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        return this.containsFile(backend, name);
    }

    public getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        return this.getFile(backend, name);
    }

    public getDocMeta(fingerprint: string): Promise<string | null> {
        return this.delegate.getDocMeta(fingerprint);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.delegate.getDocMetaFiles();
    }

    public init(): Promise<any> {
        return this.delegate.init();
    }

    public sync(fingerprint: string, data: any): Promise<void> {
        return this.delegate.sync(fingerprint, data);
    }

}

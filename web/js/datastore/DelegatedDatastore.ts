import {Datastore} from './Datastore';
import {Directories} from './Directories';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {DeleteResult} from './DiskDatastore';
import {Preconditions} from '../Preconditions';

/**
 * A datastore that just forwards events to the given delegate.
 */
export class DelegatedDatastore implements Datastore {

    public readonly directories: Directories;

    public readonly logsDir: string;

    public readonly stashDir: string;

    private readonly delegate: Datastore;

    constructor(delegate: Datastore) {
        Preconditions.assertPresent(delegate, 'delegate');
        this.delegate = delegate;
        this.directories = new Directories();
        this.logsDir = delegate.logsDir;
        this.stashDir = delegate.stashDir;

    }

    public contains(fingerprint: string): Promise<boolean> {
        return this.delegate.contains(fingerprint);
    }

    public delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {
        return this.delegate.delete(docMetaFileRef);
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

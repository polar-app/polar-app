/**
 * Datastore just in memory with no on disk persistence.
 */
import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FilePaths} from '../util/FilePaths';
import {Directories} from './Directories';
import {Logger} from '../logger/Logger';
import {DeleteResult} from './Datastore';
import {FileDeleted} from '../util/Files';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';

const log = Logger.create();

export class MemoryDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly filesDir: string;

    public readonly dataDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    protected readonly docMetas: {[fingerprint: string]: string} = {};

    constructor() {
        this.directories = new Directories();

        // these dir values are used in the UI and other places so we need to
        // actually have values for them.
        this.dataDir = Directories.getDataDir().path;
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.filesDir = FilePaths.create(this.dataDir, "files");

        this.logsDir = FilePaths.create(this.dataDir, "logs");

        this.docMetas = {};

    }

    // noinspection TsLint
    public async init() {
        await this.directories.init();
    }

    public async contains(fingerprint: string): Promise<boolean> {
        return fingerprint in this.docMetas;
    }

    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        const result: any = {
            docMetaFile: {
                path: `/${docMetaFileRef.fingerprint}.json`,
                deleted: false
            },
            dataFile: {
                path: `/${docMetaFileRef.filename}`,
                deleted: false
            }
        };

        if (await this.contains(docMetaFileRef.fingerprint)) {
            result.docMetaFile.deleted = true;
            result.dataFile.deleted = true;
        }

        return result;

    }

    public writeFile(backend: Backend, name: string, data: Buffer | string): Promise<DatastoreFile> {
        throw new Error("Not implemented");
    }

    public getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {
        throw new Error("Not implemented");
    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {
        throw new Error("Not implemented");
    }

    public deleteFile(backend: Backend, name: string): Promise<void> {
        throw new Error("Not implemented");
    }

    /**
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const nrDocs = Object.keys(this.docMetas).length;

        log.info(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`);

        return this.docMetas[fingerprint];
    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string,
                      data: string,
                      docInfo: DocInfo,
                      datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<void> {

        Preconditions.assertTypeOf(data, "string", "data");

        this.docMetas[fingerprint] = data;

        datastoreMutation.written.resolve(true);
        datastoreMutation.committed.resolve(true);

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        return Object.keys(this.docMetas)
            .map(fingerprint => <DocMetaRef> {fingerprint});

    }

}

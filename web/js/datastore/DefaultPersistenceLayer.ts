import {Datastore, DeleteResult, DocMetaSnapshotEventListener, ErrorListener, FileMeta, FileRef, SnapshotResult} from './Datastore';
import {DocMeta} from '../metadata/DocMeta';
import {DocMetas} from '../metadata/DocMetas';
import {isPresent, Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {Dictionaries} from '../util/Dictionaries';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {PersistenceLayer} from './PersistenceLayer';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';
import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {Reducers} from '../util/Reducers';
import {DocInfo} from '../metadata/DocInfo';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreMutations} from './DatastoreMutations';
import {UUIDs} from '../metadata/UUIDs';
import {NULL_FUNCTION} from '../util/Functions';

const log = Logger.create();

/**
 * First layer before the raw datastore. At one point we allowed the datastore
 * to perform all the data manipulation / serialization but we ran into problems
 * with node+chrome behaving differently so now we just make node work with raw
 * strings.
 */
export class DefaultPersistenceLayer implements PersistenceLayer {

    public readonly id = 'default';

    public readonly datastore: Datastore;

    private datastoreMutations: DatastoreMutations;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
        this.datastoreMutations = DatastoreMutations.create('written');
    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION) {
        await this.datastore.init(errorListener);
    }

    public async stop() {
        await this.datastore.stop();
    }

    public contains(fingerprint: string): Promise<boolean> {
        return this.datastore.contains(fingerprint);
    }

    public delete(docMetaFileRef: DocMetaFileRef,
                  datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()): Promise<DeleteResult> {

        return this.datastore.delete(docMetaFileRef, datastoreMutation);

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<DocMeta | undefined> {

        const data = await this.datastore.getDocMeta(fingerprint);

        if (!isPresent(data)) {
            return undefined;
        }

        if (! (typeof data === "string")) {
            throw new Error("Expected string and received: " + typeof data);
        }

        const docMeta = DocMetas.deserialize(data, fingerprint);

        return docMeta;

    }

    /**
     * Convenience method to not require the fingerprint.
     */
    public async writeDocMeta(docMeta: DocMeta, datastoreMutation?: DatastoreMutation<DocInfo>): Promise<DocInfo> {

        Preconditions.assertPresent(docMeta, "No docMeta");
        Preconditions.assertPresent(docMeta.docInfo, "No docInfo on docMeta");
        Preconditions.assertPresent(docMeta.docInfo.fingerprint, "No fingerprint on docInfo");

        return this.write(docMeta.docInfo.fingerprint, docMeta, datastoreMutation);

    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       docMeta: DocMeta,
                       datastoreMutation: DatastoreMutation<DocInfo> = new DefaultDatastoreMutation()): Promise<DocInfo> {

        Preconditions.assertNotNull(fingerprint, "fingerprint");
        Preconditions.assertNotNull(docMeta, "docMeta");

        if (! (docMeta instanceof DocMeta)) {
            // check to make sure nothing from JS-land can call this
            // incorrectly.
            throw new Error("Can not sync anything other than DocMeta.");
        }

        // create a copy of docMeta so we can mutate it without the risk of
        // firing event listeners via proxies and then we can update the
        // lastUpdated time.  We're also going to have to fire and advertisement
        // that it's been updated.

        docMeta = Dictionaries.copyOf(docMeta);

        // now update the lastUpdated times before we commit to disk.
        docMeta.docInfo.lastUpdated = ISODateTimeStrings.create();

        docMeta.docInfo.nrComments = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.comments))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrNotes = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.notes))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrFlashcards = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.flashcards))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrTextHighlights = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.textHighlights))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrAreaHighlights = Object.values(docMeta.pageMetas)
            .map(current => Dictionaries.countOf(current.areaHighlights))
            .reduce(Reducers.SUM, 0);

        docMeta.docInfo.nrAnnotations =
            docMeta.docInfo.nrComments +
            docMeta.docInfo.nrNotes +
            docMeta.docInfo.nrFlashcards +
            docMeta.docInfo.nrTextHighlights +
            docMeta.docInfo.nrAreaHighlights;

        if (docMeta.docInfo.added === undefined) {
            docMeta.docInfo.added = ISODateTimeStrings.create();
        }

        // update the sequence before we write it out to disk.
        docMeta.docInfo.uuid = UUIDs.create();

        log.info(`Sync of docMeta with fingerprint: ${fingerprint} and UUID: ` + docMeta.docInfo.uuid);

        // NOTE that we always write the state with JSON pretty printing.
        // Otherwise tools like git diff , etc will be impossible to deal with
        // in practice.
        const data = DocMetas.serialize(docMeta);

        const docInfo = Object.assign({}, docMeta.docInfo);

        const syncMutation = new DefaultDatastoreMutation<boolean>();
        this.datastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);

        await this.datastore.write(fingerprint, data, docInfo, syncMutation);

        return docInfo;

    }

    public async synchronizeDocs(...docMetaRefs: DocMetaRef[]): Promise<void> {
        return this.datastore.synchronizeDocs(...docMetaRefs);
    }

    public getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.datastore.getDocMetaFiles();
    }

    /**
     * Get a current snapshot of the internal state of the Datastore by receiving
     * DocMetaSnapshotEvent on the initial state.
     */
    public snapshot(listener: DocMetaSnapshotEventListener,
                    errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {
        return this.datastore.snapshot(listener, errorListener);
    }

    public async createBackup(): Promise<void> {
        return this.datastore.createBackup();
    }

    public writeFile(backend: Backend, ref: FileRef, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {
        return this.datastore.writeFile(backend, ref, data, meta);
    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        return this.datastore.containsFile(backend, ref);
    }

    public getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {
        return this.datastore.getFile(backend, ref);
    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        this.datastore.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }

    public async deactivate() {
        await this.datastore.deactivate();
    }

}


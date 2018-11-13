import {Datastore, FileMeta} from './Datastore';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {Directories} from './Directories';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DeleteResult} from './Datastore';
import {Firestore} from '../firestore/Firestore';
import {Firebase} from '../firestore/Firebase';
import {DocInfo, IDocInfo} from '../metadata/DocInfo';
import {Preconditions} from '../Preconditions';
import {Hashcodes} from '../Hashcodes';
import * as firebase from '../firestore/lib/firebase';
import {Elements} from '../util/Elements';
import {ResolvablePromise} from '../util/ResolvablePromise';
import {Dictionaries} from '../util/Dictionaries';
import {DatastoreFiles} from './DatastoreFiles';

const log = Logger.create();

// You can allow users to sign in to your app using multiple authentication
// providers by linking auth provider credentials to an existing user account.
// Users are identifiable by the same Firebase user ID regardless of the
// authentication provider they used to sign in. For example, a user who signed
// in with a password can link a Google account and sign in with either method
// in the future. Or, an anonymous user can link a Facebook account and then,
// later, sign in with Facebook to continue using your app.

//
// TODO: all files need to also have associated metadata in firestore and
// the binary data is stored in firebase storage.

export class CompositeFirebaseDatastore implements Datastore {

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly directories: Directories;

    private app?: firebase.app.App;

    private firestore?: firebase.firestore.Firestore;

    private storage?: firebase.storage.Storage;

    private readonly local: Datastore;

    private readonly resolveablePromiseIndex = new ResolveablePromiseIndex<Mutation>();

    constructor(local: Datastore) {
        this.local = local;

        this.directories = this.local.directories;
        this.stashDir = this.local.stashDir;
        this.logsDir = this.local.logsDir;

    }

    public async init() {

        await this.local.init();

        // get the firebase app. Make sure we are initialized externally.
        this.app = firebase.app();
        this.firestore = await Firestore.getInstance();
        this.storage = firebase.storage();

        // setup the initial snapshot so that we query for the users existing data...

        const uid = this.getUserID();

        await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .where('uid', '==', uid)
            .onSnapshot(snapshot => this.onSnapshot(snapshot));

        return {};

    }

    public async stop() {
        // FIXME: noop for now
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    public async contains(fingerprint: string): Promise<boolean> {
        return this.local.contains(fingerprint);
    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        // TODO: these could get out of sync and we have to force them to
        // execute together.  The remote delete followed by the local ...

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, docMetaFileRef.fingerprint);

        const resolveablePromise = new ResolvablePromise<Mutation>();

        this.resolveablePromiseIndex.add(id, resolveablePromise);

        const documentSnapshot = await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id)
            .delete();

        // wait for this promise to resolve and then perform the local delete of
        // the local file.

        await resolveablePromise;

        return this.local.delete(docMetaFileRef);

    }

    /**
     * Get the DocMeta we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {
        return this.local.getDocMeta(fingerprint);
    }

    // TODO: the cloud storage operations are possibly unsafe and could
    // leave local files in place or too many remote files but this is good
    // for a first MVP pass.

    // TODO: if the file is ONLY in firestore it won't be sync'd on a remote
    // computer so we should try to pull it down just in time when requested.

    public async writeFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {
        DatastoreFiles.assertValidFileName(name);

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${name}`);

        let uploadTask: firebase.storage.UploadTask;

        if (typeof data === 'string') {
            uploadTask = fileRef.putString(data);
        } else {
            uploadTask = fileRef.put(Uint8Array.from(data));

        }

        await uploadTask;

        return this.local.writeFile(backend, name, data, meta);


    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {

        DatastoreFiles.assertValidFileName(name);

        const localFile = await this.local.getFile(backend, name);

        if (localFile.isPresent()) {
            return localFile;
        }

        // TODO: it's probably in firestore, just not copied locally yet.
        // shouldn't we pull it and write it locally then?

        // TODO: we need to copy it locally... then serve it form the local
        // cache.

        const storage = this.storage!;

        const fileRef = storage.ref().child(`${backend}/${name}`);

        const url: string = await fileRef.getDownloadURL();
        const meta = await fileRef.getMetadata();

        return Optional.of({backend, name, url, meta});

    }

    public async containsFile(backend: Backend, name: string): Promise<boolean> {
        DatastoreFiles.assertValidFileName(name);

        if ( await this.local.containsFile(backend, name)) {
            return true;
        }

        // TODO: we should have some cache here to avoid checking the server too
        // often but I don't think this is goign to be used often.

        const storage = this.storage!;
        const fileRef = storage.ref().child(`${backend}/${name}`);

        try {
            await fileRef.getMetadata();
            return true;
        } catch (e) {

            if (e.code === "storage/object-not-found") {
                return false;
            }

            // some other type of exception ias occurred
            throw e;

        }

    }

    public async deleteFile(backend: Backend, name: string): Promise<void> {
        DatastoreFiles.assertValidFileName(name);

        const storage = this.storage!;
        const fileRef = storage.ref().child(`${backend}/${name}`);
        await fileRef.delete();

        return this.local.deleteFile(backend, name);
    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string, data: string, docInfo: DocInfo) {

        const uid = this.getUserID();
        const id = this.computeDocMetaID(uid, fingerprint);

        const resolveablePromise = new ResolvablePromise<Mutation>();

        this.resolveablePromiseIndex.add(id, resolveablePromise);

        docInfo = Object.assign({}, Dictionaries.onlyDefinedProperties(docInfo));

        const docMetaHolder: DocMetaHolder = {
            docInfo,
            value: data
        };

        const recordHolder: RecordHolder<DocMetaHolder> = {
            uid,
            id,
            visibility: Visibility.PRIVATE,
            value: docMetaHolder
        };

        await this.firestore!
            .collection(DatastoreCollection.DOC_META)
            .doc(id)
            .set(recordHolder);

        await resolveablePromise;

        return this.local.write(fingerprint, data, docInfo);

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {
        return this.local.getDocMetaFiles();
    }

    /**
     * Called when new data is available from Firebase so we can solve promises,
     * add things to local stores, etc.
     *
     * ALL operations are done via snapshots which we create and subscribe to
     * on init().
     *
     * This solves to problems:
     *
     * 1. The most important, is that when data is added remotely (the user is
     *    on another machine and this machine-rejoins the network or detects
     *    changes) then content if pulled locally and added to the local
     *    datastore.
     *
     * 2. Local data is added via the same code path.  The code path is remote-
     *    first but then then immediately resolved from the cache and added
     *    locally.
     */
    private onSnapshot(snapshot: firebase.firestore.QuerySnapshot) {

        console.log("FIXME: fromCache", snapshot.metadata.fromCache, snapshot.metadata, snapshot);

        const messagesElement = document.getElementById('messages')!;

        for (const docChange of snapshot.docChanges()) {

            const record = <RecordHolder<DocMetaHolder>> docChange.doc.data();

            console.log("FIXME: data: " , docChange.doc.data(), snapshot.metadata);

            switch (docChange.type) {

                case 'added':
                    this.onSnapshotDocUpdated(record);
                    break;

                case 'modified':
                    this.onSnapshotDocUpdated(record);
                    break;

                case 'removed':
                    this.onSnapshotDocRemoved(record);
                    break;

            }

        }

    }

    private onSnapshotDocUpdated(record: RecordHolder<DocMetaHolder>) {
        this.resolveablePromiseIndex.resolve(record.id, {});
    }

    private onSnapshotDocRemoved(record: RecordHolder<DocMetaHolder>) {
        this.resolveablePromiseIndex.resolve(record.id, {});
    }

    private computeDocMetaID(uid: UserID, fingerprint: string) {
        return Hashcodes.createID(uid + ':' + fingerprint, 32);
    }

    private getUserID(): UserID {

        const auth = this.app!.auth();
        Preconditions.assertPresent(auth, "Not authenticated");

        const user = auth.currentUser;
        Preconditions.assertPresent(user, "Not authenticated");

        return user!.uid;
    }

}

/**
 * Holds a data object literal by value. This contains the high level
 * information about a document including the ID and the visibility.  The value
 * object points to a more specific object which hold the actual data we need.
 */
export interface RecordHolder<T> {

    // the owner of this record.
    readonly uid: UserID;

    // the visibilty of this record.
    readonly visibility: Visibility;

    readonly id: string;

    readonly value: T;

}

export interface DocMetaHolder {

    // expose the high level DocInfo on this object which allows us to search by
    // URL, tags, etc.
    readonly docInfo: IDocInfo;

    // FIXME: change this type to DocMeta and then disable indexing on it in
    // firebase as most of the values here don't need to be indexed.
    readonly value: string;

}


export enum Visibility {

    /**
     * Only visible for the user.
     */
    PRIVATE,

    /**
     * Only to users that
     */
    FOLLOWING,

    /**
     * To anyone on the service.
     */
    PUBLIC

}

enum DatastoreCollection {

    DOC_META = "doc_meta"

}

type UserID = string;

/**
 * The result of a FB database mutation.
 */
interface Mutation {

}

/**
 * Allows us to externally resolve promises that are waiting to be resolved.
 */
class ResolveablePromiseIndex<T> {

    private backing: {[id: string]: Array<ResolvablePromise<T>>} = {};

    public add(id: string, promise: ResolvablePromise<T>): void {

        if (id in this.backing) {
            this.backing[id].push(promise);
        } else {
            this.backing[id] = [promise];
        }

    }

    /**
     * Resolve all the values of id with the given value.
     */
    public resolve(id: string, value: T) {

        const promises = this.backing[id];

        if (promises) {

            for (const promise of promises) {
                promise.resolve(value);
            }

            delete this.backing[id];
        }

    }

}

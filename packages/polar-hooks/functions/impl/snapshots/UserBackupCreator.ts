import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import stream, {PassThrough, Readable, Transform} from 'stream'
import * as util from 'util'
import {Datastores} from "../datastore/Datastores";
import {IDStr} from "polar-shared/src/util/Strings";
import {Lazy} from "polar-shared/src/util/Lazy";
import {File} from '@google-cloud/storage';
import {ArchiveWritable} from "./ArchiveWritable";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {SnapshotTransformer} from "./SnapshotTransformer";
import {FileRef} from 'polar-shared/src/datastore/FileRef';
import {Backend} from "polar-shared/src/datastore/Backend";
import {ZipStreamChunk} from "./ZipStreamChunk";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseDatastores} from "polar-shared-datastore/src/FirebaseDatastores";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);
const firebaseApp = Lazy.create(() => FirebaseAdmin.app());

export namespace UserBackupCreator {

    interface IUserDataArchive {
        readonly url: string;
    }

    interface UserFileRef extends FileRef {
        uid: string;
    }


    export async function create(uid: IDStr): Promise<IUserDataArchive> {
        const now = ISODateTimeStrings.create();

        const filename = `${Hashcodes.createRandomID()}-${now}.zip`;
        const storageFile = createFileInTmpBucket(`snapshots/${filename}`);

        const writeStream = storageFile.createWriteStream();

        const streams = [];

        // Iterate the Firestore collections we need to backup
        const collectionsToBackup = [
            'doc_meta',
            'doc_info',
            'block',
        ];

        for (let collectionToBackup of collectionsToBackup) {
            // Generate a NodeJS Readable stream based on the data within the
            // Firestore Collection, filtered by the user's UID
            const stream = await createStreamFromCollection({
                collection: collectionToBackup,
                uid,
            });

            // Push a "transformed" version of the original Stream. The transformed Stream converts original
            // Firestore document snapshots to chunks of objects that are accepted as input by the "archiver"
            // library, which ArchiveWritable.ts (the target of these Readable streams) uses internally later
            streams.push(
                stream.pipe(new SnapshotTransformer(collectionToBackup, {highWaterMark: 1}))
            );
        }

        // Also push a Readable stream that provide raw Cloud Storage PDF/EPUB files as output
        streams.push(await createStreamFromFilestorage(uid));

        // Combine all collected Readable streams and pipe them to a single Writable stream
        await util.promisify(stream.pipeline)(
            mergeStreams(...streams),
            new ArchiveWritable(writeStream, {highWaterMark: 1})
        )

        // Flush the Writable stream (to a temporary Google Cloud Storage file)
        writeStream.end();

        // When the temporary file URL is visited in the browser, force it to download instead of being
        // opened by the native Browser viewer
        await storageFile.setMetadata({contentDisposition: `attachment; filename="${filename}"`})

        // Make the file publicly downloadable through its link
        await storageFile.makePublic();

        return {
            url: storageFile.publicUrl(),
        };
    }

    const mergeStreams = (...streams: any[]) => {
        let pass = new PassThrough({
            objectMode: true,
        })
        let waiting = streams.length
        for (let stream of streams) {
            pass = stream.pipe(pass, {end: false})
            stream.once('end', () => --waiting === 0 && pass.emit('end'))
        }
        return pass
    }


    async function createStreamFromCollection(config: {
        collection: string,
        uid: string,
    }) {
        return firebaseApp()
            .firestore()
            .collection(config.collection)
            .where('uid', '==', config.uid)
            .stream();
    }


    /**
     * Get a reference to a Firebase Storage File
     */
    function getFirebaseFile(fileRef: UserFileRef) {
        const backend = Backend.STASH;
        const uid = fileRef.uid;
        const storagePath = FirebaseDatastores.computeStoragePath(backend, fileRef, uid);
        const project = storageConfig().config.project;
        const bucketName = `gs://${project}.appspot.com`;
        const bucket = storage().bucket(bucketName);
        return new File(bucket, storagePath.path);
    }

    /**
     * Create a file reference in the temporary Google Cloud Storage bucket
     * where files expire in 72 hours
     */
    function createFileInTmpBucket(file: string) {
        const project = storageConfig().config.project;
        const bucketName = `gs://tmp-${project}`;
        const bucket = storage().bucket(bucketName);
        return new File(bucket, file);
    }

    async function createStreamFromFilestorage(uid: string) {
        const readable = new Readable({
            objectMode: true,
            highWaterMark: 1,
        });
        const data = await firebaseApp()
            .firestore()
            .collection('doc_meta')
            .where('uid', '==', uid)
            .get();
        // data.docs.map(doc => console.log('doc.id', doc.id))
        for (let doc of data.docs) {
            readable.push(doc.data());
        }
        readable.push(null);

        // const stream = await createStreamFromCollection({
        //     collection: 'doc_meta',
        //     uid,
        // });

        const transformerFirebaseObjectToLocalFile = new Transform({
            objectMode: true,
            highWaterMark: 1,
            transform(firebaseObject, encoding, callback) {

                // i'm not sure how to prevent this error
                async function doAsync() {

                    const id = firebaseObject.id;

                    console.log(id, 'transformerFirebaseObjectToLocalFile._transform()');

                    const name = firebaseObject.value.docInfo.filename;
                    const hashcode = firebaseObject.value.docInfo.hashcode;

                    if (!name) {
                        console.error(id, 'Encountered a document with no filename and hashcode field: ' + firebaseObject.id);
                        console.error(id, JSON.stringify(firebaseObject, null, 2))
                        callback(null, null);
                        return;
                    }
                    console.log(id, name, hashcode);

                    const file = getFirebaseFile({
                        uid,
                        name,
                        hashcode: hashcode ? hashcode : undefined,
                    });

                    const filePath = FirebaseDatastores.computeStoragePath(Backend.STASH, {name}, uid)

                    try {
                        const exists = (await file.exists())[0];
                        if (!exists) {
                            console.error(id, 'Filename does not exist', name);
                            callback(null, null);
                            return;
                        }
                    } catch (e) {
                        console.error(id, 'Filename does not exist', name);
                        console.error(id, e);
                        callback(null, null);
                        return;
                    }


                    // Build a ZipStreamChunk object that is suitable as entry chunks for the "archiver" package
                    const zipEntry: ZipStreamChunk = {
                        source: file.createReadStream(),
                        data: {
                            name: filePath.path,
                        }
                    }

                    callback(null, zipEntry)
                }

                doAsync()
                    .catch(err => {
                        callback(null, null);
                        console.error(err);
                    });

            }
        });

        return readable.pipe(transformerFirebaseObjectToLocalFile);
    }
}

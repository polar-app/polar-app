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
import {FirebaseDatastores} from "../../../../../polar-bookshelf/web/js/datastore/FirebaseDatastores";
import {FileRef} from "../polar-shared/datastore/Datastore";
import {Backend} from "polar-shared/src/datastore/Backend";
import {QueryDocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {ZipStreamChunk} from "./ZipStreamChunk";
import path from "path";

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
            .limit(100) // @TODO figure out why it doesn't work with the full set
            .stream();
    }

    export async function create(uid: IDStr): Promise<IUserDataArchive> {
        const now = ISODateTimeStrings.create();

        const filename = `${now}.zip`;
        const storageFile = createFileInTmpBucket(`snapshots/${filename}`);

        const writeStream = storageFile.createWriteStream();

        const transformedStreamsForZipFile: SnapshotTransformer[] = [];

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

            transformedStreamsForZipFile.push(
                // Push a "transformed" version of the original stream of Firestore documents
                // Transformed version emits values that are suitable as inputs for the "archiver" library,
                // which is the one we use for creating the .zip file with the backup
                stream.pipe(new SnapshotTransformer(collectionToBackup, {highWaterMark: 5}))
            );
        }

        // const file = getFirebaseFile({
        //     uid: "3j5Lr2zxamMyNIkzWJkq5sxY4f63",
        //     name: "12Ji9JDcRn-availability.pdf",
        //     hashcode: {
        //         alg: HashAlgorithm.KECCAK256,
        //         data: "12Ji9JDcRnZT27jeckr4HusYY29QVwj4Wv2J6iYc5YXjtzn3ZJT",
        //         enc: HashEncoding.BASE58CHECK,
        //     },
        // });
        //
        // const expires = new Date(new Date().setHours(new Date().getHours() + 4));
        //
        // const signedURL = await file.getSignedUrl({
        //     expires,
        //     action: "read",
        // })

        await util.promisify(stream.pipeline)(
            mergeStreams(
                ...transformedStreamsForZipFile,
                await createStreamFromFilestorage(uid)
            ),
            new ArchiveWritable(writeStream, {highWaterMark: 3})
        )

        // Flush the write stream so the process can end
        writeStream.end();

        // Force the file to be downloaded instead of opened natively within the browser
        await storageFile.setMetadata({contentDisposition: `attachment; filename="${filename}"`})

        // Make the file publicly downloadable through its link
        await storageFile.makePublic();

        return {
            url: storageFile.publicUrl(),
        };

        // @TODO Archive all PDFs that back these docs into a zip file as well
        // @TODO Create a metadata file within the root of the zip files that defines the version of the backup tool
        // @TODO return just one zip file as a result
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
        const stream = await createStreamFromCollection({
            collection: 'doc_meta',
            uid,
        });

        const transformerFirebaseObjectToLocalFile = new Transform({
            objectMode: true,
            highWaterMark: 3,
            transform(chunk, encoding, callback) {
                (async () => { // wrap in a self executing async block
                    const snapshot = chunk as QueryDocumentSnapshot;

                    const id = snapshot.data().id;

                    console.log(id, 'transformerFirebaseObjectToLocalFile._transform()');

                    const name = snapshot.data().value.docInfo.filename;
                    const hashcode = snapshot.data().value.docInfo.hashcode;

                    if (!name) {
                        console.error(id, 'Encountered a document with no filename and hashcode field: ' + snapshot.data().id);
                        // console.error(id, JSON.stringify(snapshot.data(), null, 2))
                        callback(null, null);
                        return;
                    }
                    // console.log(JSON.stringify(snapshot.data().value.docInfo, null, 2));
                    console.log(id, name, hashcode);

                    const file = getFirebaseFile({
                        uid,
                        name,
                        hashcode: hashcode ? hashcode : undefined,
                    });

                    const backend = Backend.STASH;
                    const fileRef = {
                        name: name,
                        backend
                    };
                    const filePath = FirebaseDatastores.computeStoragePath(backend, fileRef, uid)

                    console.log('filePath', filePath.path);
                    try {
                        const exists = (await file.exists())[0];
                        console.log(filePath.path, 'exists', exists);
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
                })();
            }
        });

        return stream.pipe(transformerFirebaseObjectToLocalFile);

        // const stream = new Readable();
        //
        // // @TODO Read the files from Cloud Storage, download them and pipe their local path to the stream
        //
        // // Mark the stream as "finished"
        // stream.push(null);
        //
        // return stream;
    }
}

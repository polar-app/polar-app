import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import stream, {PassThrough, Readable} from 'stream'
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
            .stream();
    }

    export async function create(uid: IDStr): Promise<IUserDataArchive> {
        const now = ISODateTimeStrings.create();

        const filename = `${now}.zip`;
        const storageFile = createFileInTmpBucket(`snapshots/${filename}`);

        const writeStream = storageFile.createWriteStream();

        const streamsForZipFile: SnapshotTransformer[] = [];

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

            streamsForZipFile.push(
                // Push a "transformed" version of the original stream of Firestore documents
                // Transformed version emits values that are suitable as inputs for the "archiver" library
                // for creating zip files
                stream.pipe(new SnapshotTransformer(collectionToBackup, {highWaterMark: 1}))
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
                ...streamsForZipFile,
                await createStreamFromFilestorage(uid)
            ),
            new ArchiveWritable(writeStream, {highWaterMark: 1})
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

    function createStreamFromFilestorage(uid: string) {
        const stream = new Readable();

        // @TODO Read the files from Cloud Storage, download them and pipe their local path to the stream

        // Mark the stream as "finished"
        stream.push(null);

        return stream;
    }
}

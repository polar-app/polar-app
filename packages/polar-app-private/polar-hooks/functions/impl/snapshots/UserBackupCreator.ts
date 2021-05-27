import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import stream, {PassThrough} from 'stream'
import * as util from 'util'
import {Datastores} from "../datastore/Datastores";
import {IDStr} from "polar-shared/src/util/Strings";
import {Lazy} from "polar-shared/src/util/Lazy";
import {File} from '@google-cloud/storage';
import {ArchiveWritable} from "./ArchiveWritable";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {SnapshotTransformer} from "./SnapshotTransformer";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);
const firebaseApp = Lazy.create(() => FirebaseAdmin.app());

export namespace UserBackupCreator {

    interface IUserDataArchive {
        readonly url: string;
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
            .stream()
            .pipe(new SnapshotTransformer(config.collection, {highWaterMark: 1}));
    }

    export async function create(uid: IDStr): Promise<IUserDataArchive> {
        const now = ISODateTimeStrings.create();

        const filename = `${now}.zip`;
        const storageFile = createFileInTmpBucket(`snapshots/${filename}`);

        const writeStream = storageFile.createWriteStream();

        const streamForDocMeta = await createStreamFromCollection({
            collection: 'doc_meta',
            uid,
        });

        const streamForDocInfo = await createStreamFromCollection({
            collection: 'doc_info',
            uid,
        });

        await util.promisify(stream.pipeline)(
            mergeStreams(streamForDocMeta, streamForDocInfo),
            new ArchiveWritable(writeStream, {highWaterMark: 1})
        )

        writeStream.end();

        await storageFile.setMetadata({contentDisposition: `attachment; filename="${filename}"`})

        await storageFile.makePublic();

        return {
            url: storageFile.publicUrl(),
        };

        // @TODO Archive all PDFs that back these docs into a zip file as well
        // @TODO Create a metadata file within the root of the zip files that defines the version of the backup tool
        // @TODO return just one zip file as a result
    }

}

function createFileInTmpBucket(file: string) {
    const project = storageConfig().config.project;
    const bucketName = `gs://tmp-${project}`;
    const bucket = storage().bucket(bucketName);
    return new File(bucket, file);
}

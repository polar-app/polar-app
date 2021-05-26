import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import stream from 'stream'
import * as util from 'util'
import {Datastores} from "../datastore/Datastores";
import {IDStr} from "polar-shared/src/util/Strings";
import {Lazy} from "polar-shared/src/util/Lazy";
import {File} from '@google-cloud/storage';
import {ArchiveWritable} from "./ArchiveWritable";
import {SnapshotTransformer} from "./SnapshotTransformer";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);
const firebaseApp = Lazy.create(() => FirebaseAdmin.app());

export namespace ArchiveStreams {

    interface IUserDataArchive {
        readonly url: string;
    }

    async function copyCollectionToStorageFile(config: {
        collection: string,
        uid: string,
        storageFile: File,
    }) {
        const collectionStream = firebaseApp()
            .firestore()
            .collection(config.collection)
            .where('uid', '==', config.uid)
            .stream();

        await util.promisify(stream.pipeline)(
            collectionStream,
            new SnapshotTransformer(config.collection, {highWaterMark: 1}),
            new ArchiveWritable(config.storageFile.createWriteStream(), {highWaterMark: 1})
        );

        return true;
    }

    export async function create(uid: IDStr): Promise<IUserDataArchive> {
        const now = ISODateTimeStrings.create();

        const filename = `${now}.zip`;
        const storageFile = createFileInTmpBucket(`snapshots/${filename}`);

        await copyCollectionToStorageFile({
            collection: 'doc_meta',
            uid,
            storageFile,
        });

        await copyCollectionToStorageFile({
            collection: 'doc_info',
            uid,
            storageFile,
        });

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

import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import stream from 'stream'
import { promisify } from 'util'
import {Datastores} from "../datastore/Datastores";
import {IDStr} from "polar-shared/src/util/Strings";
import {Lazy} from "polar-shared/src/util/Lazy";
import {File} from '@google-cloud/storage';
import {FirebaseAdmin} from "../../../../../../tmp/polar-app-private/polar-firebase-admin/src/FirebaseAdmin";
import {ArchiveWritable} from "./ArchiveWritable";
import {SnapshotTransformer} from "./SnapshotTransformer";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

export namespace ArchiveStreams {

    export async function create(uid: IDStr) {

        const now = ISODateTimeStrings.create();

        const fileName = `${now}.zip`

        const storageFile = createSnapshotStorageFile(`snapshots/${fileName}`);

        const {firestore} = FirebaseAdmin.app();

        const docMetaStream =
            firestore().collection('doc_meta')
                       .where('uid', '==', uid)
                       .stream();

        // FIXME: next steps
        //
        // - how do I stream all the PDF items to the ArchiveWritable...

        await promisify(stream.pipeline)(
            docMetaStream,
            new SnapshotTransformer('doc_meta', { highWaterMark: 1 }),
            new ArchiveWritable(storageFile.createWriteStream(), { highWaterMark: 1 })
        );

        await storageFile.setMetadata({ contentDisposition: `attachment; filename="${fileName}"` })

    }

}

function createSnapshotStorageFile(file: string) {

    const project = storageConfig().config.project;

    const bucketName = `gs://${project}.appspot.com`;

    const bucket = storage().bucket(bucketName);

    return new File(bucket, file);

}

import { ServiceAccounts } from "polar-firebase-admin/src/FirebaseAdmin";
import { File, Storage, Bucket} from '@google-cloud/storage';
import { FirebaseConfig } from 'polar-firebase-admin/src/FirebaseConfig';
import { Hashcodes } from 'polar-shared/src/util/Hashcodes';

export namespace FileUpload {
    type CaptureExtension = 'pdf' | 'epub';

    async function getBucket(): Promise<Bucket> {
        const config = FirebaseConfig.create()!;

        const bucketName = `gs://tmp-${config.project}`;

        const storage = new Storage(ServiceAccounts.toStorageOptions(config.serviceAccount));

        const bucket = storage.bucket(bucketName);

        return bucket;
    }

    export async function init(extension: CaptureExtension) {
        const bucket = await getBucket();

        const filename = `${Hashcodes.createRandomID()}.${extension}`;

        const path = `captures/${filename}`;

        const file = new File(bucket, path);

        const uploadStream = file.createWriteStream();

        return { file, uploadStream };
    }
}
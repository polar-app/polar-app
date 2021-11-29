import { Datastores } from "polar-hooks/functions/impl/datastore/Datastores";
import { Hashcodes } from 'polar-shared/src/util/Hashcodes';
import { File } from '@google-cloud/storage'
export namespace FileUpload {

    export function init() {

        const { config, storage} = Datastores.createStorage();
    
        const tmpName = "testcapture.pdf";

        const bucketName = `gs://${config.project}.appspot.com`;

        const bucket = storage.bucket(bucketName);

        const path = `tmpCapture/${tmpName}`;

        const file = new File(bucket, path);

        const stream = file.createWriteStream();

        return {path, file, stream};
    }
}
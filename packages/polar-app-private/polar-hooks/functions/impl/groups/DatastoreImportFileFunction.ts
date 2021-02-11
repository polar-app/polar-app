import {File} from '@google-cloud/storage';
import {FileRef} from '../polar-shared/datastore/Datastore';
import {FirebaseDatastores} from '../polar-shared/datastore/FirebaseDatastores';
import {trace} from '../trace';
import {Datastores} from '../datastore/Datastores';
import {IDUser} from '../util/IDUsers';
import {ExpressFunctions} from '../util/ExpressFunctions';
import {UserRequests} from '../util/UserRequests';
import {UserIDStr} from './db/Profiles';
import {Backend} from "polar-firebase/src/firebase/datastore/Backend";
import {Lazy} from "polar-shared/src/util/Lazy";

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

export class DatastoreImportFileFunctions {

    public static async exec(idUser: IDUser,
                             request: DatastoreImportFileRequest): Promise<DatastoreImportFileResponse> {

        trace("Parsing fetch request");

        // TODO: we could make this fetch a URL, compute a new backend and FileRef, and docID while
        // reading the URL.

        const {docID, backend, fileRef} = request;

        const docPermission = await Datastores.verifyAccess(idUser, docID);

        // FIXME: the docID is used primarily to READ the previous version and I think we have the docInfo elsewhere...

        const srcStoragePath = FirebaseDatastores.computeStoragePath(backend, fileRef, docPermission.uid);
        const destStoragePath = FirebaseDatastores.computeStoragePath(backend, fileRef, idUser.uid);

        // now compute a shared URL that we can hand out that is auto
        // revoked in 200ms or so...

        trace("Computing secure URL at path: " + srcStoragePath.path);
        await copyFile(srcStoragePath.path, destStoragePath.path, idUser.uid);

        return {
            path: destStoragePath.path,
            backend: request.backend,
            fileRef: request.fileRef,
            uid: idUser.uid
        };

    }

}

interface DatastoreImportFileRequest {
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}

interface DatastoreImportFileResponse {
    readonly backend: Backend;
    readonly fileRef: FileRef;
    readonly path: string;
    readonly uid: UserIDStr;
}

async function copyFile(src: string, dest: string, uid: UserIDStr) {

    const project = storageConfig().config.project;

    const bucketName = `gs://${project}.appspot.com`;

    trace("Creating secure URL for: ", {bucketName, path: src});

    const bucket = storage().bucket(bucketName);

    const destFile = new File(bucket, dest);
    const srcFile = new File(bucket, src);

    await srcFile.copy(destFile);

    await destFile.setMetadata({
        metadata: {
            uid
        }
    });

}

export const DatastoreImportFileFunction = ExpressFunctions.createHook('DatastoreImportFileFunction', (req, res) => {
    return UserRequests.execute(req, res, DatastoreImportFileFunctions.exec);
});

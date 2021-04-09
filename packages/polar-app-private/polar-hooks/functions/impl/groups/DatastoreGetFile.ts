import * as functions from 'firebase-functions';
import {GetSignedUrlConfig} from '@google-cloud/storage';
import {File} from '@google-cloud/storage';
import {FileRef} from '../polar-shared/datastore/Datastore';
import {FirebaseDatastores} from '../polar-shared/datastore/FirebaseDatastores';
import {trace} from '../trace';
import {Datastores} from '../datastore/Datastores';
import {DatastoreRequests} from '../datastore/DatastoreRequests';
import {IDUsers} from '../util/IDUsers';
import {Backend} from "polar-firebase/src/firebase/datastore/Backend";
import { Lazy } from '../util/Lazy';

const storageConfig = Lazy.create(() => Datastores.createStorage());
const storage = Lazy.create(() => storageConfig().storage);

/**
 * Handles fetching a a secure and temporary URL for downloading a file using
 * the the signed URL system in Firebase.
 */
export const DatastoreGetFile = functions.https.onRequest((req, res) => {

    const doHandle = async () => {

        trace("Parsing fetch request");
        const datastoreGetFileRequest = DatastoreGetFileRequests.parse(req.url);

        const {idToken, docID} = datastoreGetFileRequest;

        const idUser = await IDUsers.fromIDToken(idToken);

        const docPermission = await Datastores.verifyAccess(idUser, docID);

        trace("Computing storage path for fileRef: " + JSON.stringify(datastoreGetFileRequest));

        const storagePath = FirebaseDatastores.computeStoragePath(datastoreGetFileRequest.backend,
                                                                  datastoreGetFileRequest.fileRef,
                                                                  docPermission.uid);

        // now compute a shared URL that we can hand out that is auto
        // revoked in 200ms or so...

        trace("Computing secure URL at path: " + storagePath.path);
        const secureURL = await createSecureURL(storagePath.path);

        trace("Redirecting to secure URL: " + secureURL);

        res.redirect(secureURL);

    };

    doHandle()
        .catch(err => {
            console.error("Unable to handle request: ", err);
            res.sendStatus(500);
        });

});

class DatastoreGetFileRequests {

    public static parse(link: string): DatastoreGetFileRequest {
        return DatastoreRequests.parse(link);
    }

}

interface DatastoreGetFileRequest {
    readonly idToken: string;
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}


async function createSecureURL(path: string): Promise<string> {

    const action = "read";
    const expires = Date.now() + (5 * 60 * 1000);

    const opts: GetSignedUrlConfig = {
        action,
        expires
    };

    const project = storageConfig().config.project;

    const bucketName = `gs://${project}.appspot.com`;

    trace("Creating secure URL for: ", {bucketName, path});

    const bucket = storage().bucket(bucketName);
    const file = new File(bucket, path);

    const signedURLs = await file.getSignedUrl(opts);

    return signedURLs[0];

}

type DownloadToken = string;

type SharedURL = string;

interface SharedURLMeta {
    readonly sharedURL: SharedURL;
    readonly downloadToken: DownloadToken;
}

interface SharedURLRecord extends SharedURLMeta {
    readonly backend: string;
    readonly name: string;
}


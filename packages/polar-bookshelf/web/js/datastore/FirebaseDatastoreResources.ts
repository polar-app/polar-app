import {Backend} from 'polar-shared/src/datastore/Backend';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {CloudFunctions} from './firebase/CloudFunctions';
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {UserIDStr} from "polar-shared/src/util/Strings";
import {FirebaseDocMetaID} from "polar-shared-datastore/src/FirebaseDatastores";

export class FirebaseDatastoreResources {

    public static computeDatastoreGetFileURL(request: DatastoreGetFileRequest) {
        const endpoint = CloudFunctions.createEndpoint();
        return `${endpoint}/datastoreGetFile/?data=` + encodeURIComponent(JSON.stringify(request));
    }

    // You can allow users to sign in to your app using multiple authentication
    // providers by linking auth provider credentials to an existing user account.
    // Users are identifiable by the same Firebase user ID regardless of the
    // authentication provider they used to sign in. For example, a user who signed
    // in with a password can link a Google account and sign in with either method
    // in the future. Or, an anonymous user can link a Facebook account and then,
    // later, sign in with Facebook to continue using your app.

    public static computeDocMetaID(fingerprint: string,
                                   uid: UserIDStr): FirebaseDocMetaID {

        return Hashcodes.createID(uid + ':' + fingerprint, 32);

    }

}

interface DatastoreGetFileRequest {
    readonly idToken: string;
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}

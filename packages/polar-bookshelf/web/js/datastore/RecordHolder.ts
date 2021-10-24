import {UserID} from "polar-firebase-browser/src/firebase/FirebaseBrowser";
import {RecordPermission} from "./FirebaseDatastore";

/**
 * Holds a data object literal by value. This contains the high level
 * information about a document including the ID and the visibility.  The value
 * object points to a more specific object which hold the actual data we need.
 */
export interface RecordHolder<T> extends RecordPermission {

    // the owner of this record.
    readonly uid: UserID;

    readonly id: string;

    readonly value: T;

}

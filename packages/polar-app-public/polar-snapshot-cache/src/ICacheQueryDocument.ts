import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";

export interface ICacheQueryDocument {


    /**
     * Property of the `DocumentSnapshot` that signals whether or not the data
     * exists. True if the document exists.
     */
    readonly exists: boolean;

    /**
     * Property of the `DocumentSnapshot` that provides the document's ID.
     */
    readonly id: string;

    readonly metadata: ISnapshotMetadata;

}

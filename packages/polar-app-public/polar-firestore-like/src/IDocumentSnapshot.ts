import { TDocumentData } from "./TDocumentData";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export interface IDocumentSnapshot<M> {

    /**
     * Property of the `DocumentSnapshot` that signals whether or not the data
     * exists. True if the document exists.
     */
    readonly exists: boolean;

    /**
     * Property of the `DocumentSnapshot` that provides the document's ID.
     */
    readonly id: string;

    /**
     * Read the data from this snapshot.
     */
    readonly data: () => TDocumentData | undefined;

    readonly metadata: M;

    get(fieldPath: string /* | FieldPath */): any;

}

export interface IDocumentSnapshotClient extends IDocumentSnapshot<ISnapshotMetadata> {

}

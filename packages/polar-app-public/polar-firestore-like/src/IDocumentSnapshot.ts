import { TDocumentData } from "./TDocumentData";
import {ISnapshotMetadata} from "../../../../polar-app-public/polar-firestore-like/src/ISnapshotMetadata";
import {IQuerySnapshot} from "../../../../polar-app-public/polar-firestore-like/src/IQuerySnapshot";

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

}

export interface IDocumentSnapshotClient extends IDocumentSnapshot<ISnapshotMetadata> {

}

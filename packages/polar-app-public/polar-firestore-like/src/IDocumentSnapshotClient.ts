import { ISnapshotMetadata } from "./ISnapshotMetadata";
import { TDocumentData } from "./TDocumentData";
import {IDocumentSnapshot} from "./IDocumentSnapshot";

/**
 * Include metadata for the client.
 */
export interface IDocumentSnapshotClient extends IDocumentSnapshot {

    readonly metadata: ISnapshotMetadata;

}


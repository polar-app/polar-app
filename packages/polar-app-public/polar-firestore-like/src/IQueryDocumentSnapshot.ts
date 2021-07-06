import {TDocumentData} from "./TDocumentData";
import {IDocumentSnapshot} from "./IDocumentSnapshot";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export interface IQueryDocumentSnapshot<SM> extends IDocumentSnapshot<SM> {

    readonly data: () => TDocumentData;

}

export interface IQueryDocumentSnapshotClient extends IQueryDocumentSnapshot<ISnapshotMetadata> {

}

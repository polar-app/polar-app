import {TDocumentData} from "./TDocumentData";
import {IDocumentSnapshot} from "./IDocumentSnapshot";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

export interface IQueryDocumentSnapshot<SM, D = TDocumentData> extends IDocumentSnapshot<SM, D> {

    readonly data: () => D;

}

export interface IQueryDocumentSnapshotClient extends IQueryDocumentSnapshot<ISnapshotMetadata> {

}

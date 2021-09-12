import {ICacheQueryDocument} from "./ICacheQueryDocument";
import {ICachedQueryMetadata} from "./ICachedQueryMetadata";
import {ISnapshotMetadata} from "polar-firestore-like/src/ISnapshotMetadata";

export interface ICachedQuery extends ICachedQueryMetadata {

    readonly empty: boolean;

    readonly size: number;

    readonly metadata: ISnapshotMetadata;

    readonly docs: ReadonlyArray<ICacheQueryDocument>;

}

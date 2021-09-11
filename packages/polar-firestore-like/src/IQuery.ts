import {IGetOptions} from "./IGetOptions";
import {IQuerySnapshot} from "./IQuerySnapshot";
import {ISnapshotListenOptions} from "./ISnapshotListenOptions";
import {IFirestoreError} from "./IFirestoreError";
import {TWhereFilterOp} from "./ICollectionReference";
import {ISnapshotMetadata} from "./ISnapshotMetadata";

import {SnapshotUnsubscriber} from "polar-shared/src/util/Snapshots";

export type TOrderByDirection = 'desc' | 'asc';

export interface IQueryOrderBy {
    readonly fieldPath: string;
    readonly directionStr?: TOrderByDirection;
}

export interface IQuerySnapshotObserver<SM> {
    readonly next?: (snapshot: IQuerySnapshot<SM>) => void;
    readonly error?: (error: IFirestoreError) => void;
    readonly complete?: () => void;
}

export function isQuerySnapshotObserver<SM>(arg: any): arg is IQuerySnapshotObserver<SM> {
    return arg.next !== undefined || arg.error !== undefined || arg.complete !== undefined;
}

export interface IQuery<SM> {

    where(fieldPath: string, opStr: TWhereFilterOp, value: any): IQuery<SM>;

    get(options?: IGetOptions): Promise<IQuerySnapshot<SM>>;

    // TODO: we need these other onSnapshot methods.

    onSnapshot(observer: IQuerySnapshotObserver<SM>): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               observer: IQuerySnapshotObserver<SM>): SnapshotUnsubscriber;

    onSnapshot(onNext: (snapshot: IQuerySnapshot<SM>) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    onSnapshot(options: ISnapshotListenOptions,
               onNext: (snapshot: IQuerySnapshot<SM>) => void,
               onError?: (error: IFirestoreError) => void,
               onCompletion?: () => void): SnapshotUnsubscriber;

    /**
     * Limit the number of results returned.
     */
    limit(count: number): IQuery<SM>;

    offset(offset: number): IQuery<SM>;

    // You can also order by multiple fields. For example, if you wanted to
    // order by state, and within each state order by population in descending
    // order:
    orderBy(fieldPath: string, directionStr?: TOrderByDirection): IQuery<SM>;

    startAt(...fieldValues: any[]): IQuery<SM>;
    startAfter(...fieldValues: any[]): IQuery<SM>;

}

export interface IQueryClient extends IQuery<ISnapshotMetadata> {

}

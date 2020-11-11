/// <reference types="react" />
import { SnapshotSubscriber } from "polar-shared/src/util/Snapshots";
export interface ISnapshot<V> {
    readonly value: V | undefined;
    readonly exists: boolean;
    readonly source: 'cache' | 'server';
}
interface ProviderProps<V> {
    readonly id: string;
    readonly snapshotSubscriber: SnapshotSubscriber<ISnapshot<V>>;
    readonly onError: (err: Error) => void;
    readonly children: JSX.Element;
}
export declare type CacheProviderComponent<V> = (props: ProviderProps<V>) => JSX.Element | null;
export declare type UseSnapshotHook<V> = () => ISnapshot<V>;
export declare type CachedSnapshotTuple<V> = [CacheProviderComponent<V>, UseSnapshotHook<V>];
export declare function createCachedSnapshotSubscriber<V>(): CachedSnapshotTuple<V>;
export {};

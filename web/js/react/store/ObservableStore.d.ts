import { Subject } from "rxjs";
import React from "react";
import { Provider } from "polar-shared/src/util/Providers";
interface InternalObservableStore<V> {
    readonly subject: Subject<V>;
    current: V;
}
export interface ObservableStore<V> {
    readonly current: V;
}
export declare type SetStore<V> = (value: V) => void;
export declare type Store<V> = [V, SetStore<V>];
export declare function useObservableStore<V, K extends keyof V>(context: React.Context<ObservableStore<V>>, keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHooksOpts): Pick<V, K>;
export declare type InternalStoreContext<V> = [React.Context<ObservableStore<V>>, InternalObservableStore<V>];
export declare type StoreContext<V> = [React.Context<ObservableStore<V>>, ObservableStore<V>];
interface ObservableStoreProps<V> {
    readonly children: JSX.Element | Provider<JSX.Element>;
    readonly store?: V;
}
export declare type ObservableStoreProviderComponent<V> = (props: ObservableStoreProps<V>) => JSX.Element;
export declare type UseStoreHook<V> = (keys: ReadonlyArray<keyof V> | undefined) => Pick<V, keyof V>;
export declare type UseContextHook<V> = () => V;
export interface StoreMutator {
}
export interface IUseStoreHooksOpts {
    readonly debug?: boolean;
}
export declare type ObservableStoreTuple<V, M extends StoreMutator, C> = [ObservableStoreProviderComponent<V>, <K extends keyof V>(keys: ReadonlyArray<K> | undefined, opts?: IUseStoreHooksOpts) => Pick<V, K>, UseContextHook<C>, UseContextHook<M>];
export declare type CallbacksFactory<V, M, C> = (storeProvider: Provider<V>, setStore: SetStore<V>, mutator: M) => C;
export declare type MutatorFactory<V, M> = (storeProvider: Provider<V>, setStore: SetStore<V>) => M;
export interface ObservableStoreOpts<V, M, C> {
    readonly initialValue: V;
    readonly mutatorFactory: MutatorFactory<V, M>;
    readonly callbacksFactory: CallbacksFactory<V, M, C>;
    readonly mockCallbacksFactory?: CallbacksFactory<V, M, C>;
}
export declare function createObservableStore<V, M, C>(opts: ObservableStoreOpts<V, M, C>): ObservableStoreTuple<V, M, C>;
export {};

import {DiskBasedAsyncCacheDelegate} from "./delegates/DiskBasedAsyncCacheDelegate";
import {TestOnlyWrapper} from "./wrappers/TestOnlyWrapper";
import {FirestoreBasedAsyncCacheDelegate} from "./delegates/FirestoreBasedAsyncCacheDelegate";
import {IDStr} from "polar-shared/src/util/Strings";
import {GoogleCloudStorageBasedAsyncCacheDelegate} from "./delegates/GoogleCloudStorageBasedAsyncCacheDelegate";
import {AggregateAsyncCacheDelegate} from "./delegates/AggregateAsyncCacheDelegate";
import {AsyncCacheDelegate} from "./AsyncCacheDelegate";

export namespace AsyncCaches {

    export interface IAsyncCache<K, V> {
        readonly containsKey: (key: K) => Promise<boolean>
        // TODO: get should not return undefined as the caller should call containsKey first.
        readonly get: (key: K) => Promise<V | undefined>
        readonly put: (key: K, value: V) => Promise<void>
    }

    export type CacheDelegateName = 'disk' | 'firestore' | 'google-cloud-storage';

    export type AggregateCacheDelegateNameTuple = Readonly<[CacheDelegateName, CacheDelegateName]>;

    export function create<K, V>(nspace: IDStr,
                                 delegateName: CacheDelegateName | AggregateCacheDelegateNameTuple,
                                 wrapperName?: 'test-only'): IAsyncCache<K, V> {

        function createDirectDelegateByName(delegateName: CacheDelegateName): AsyncCacheDelegate<K, V> {

            switch(delegateName) {

                case "google-cloud-storage":
                    return GoogleCloudStorageBasedAsyncCacheDelegate.create<K, V>(nspace);

                case "disk":
                    return DiskBasedAsyncCacheDelegate.create<K, V>(nspace);

                case "firestore":
                    return FirestoreBasedAsyncCacheDelegate.create<K, V>(nspace);

            }

        }

        function createAggregateDelegate(names: AggregateCacheDelegateNameTuple): AsyncCacheDelegate<K, V> {

            const primary = createDirectDelegateByName(names[0]);
            const secondary = createDirectDelegateByName(names[1]);

            return AggregateAsyncCacheDelegate.create<K, V>(nspace, primary, secondary);

        }

        function createDelegate(): AsyncCacheDelegate<K, V> {

            if (typeof delegateName === 'string') {
                return createDirectDelegateByName(delegateName)
            }

            return createAggregateDelegate(delegateName);

        }

        const delegate = createDelegate();

        switch (wrapperName) {
            case 'test-only':
                return TestOnlyWrapper.create(delegate);
            default:
                return delegate;
        }

    }

    export type AsyncRequestResponseProviderFunction<K, V> = (input: K) => Promise<V>;

    export type WrapperFactory<K, V> = (delegate: AsyncRequestResponseProviderFunction<K, V>) => AsyncRequestResponseProviderFunction<K, V>;

    export interface IAsyncCacheWrapper<K, V> {
        readonly create: WrapperFactory<K, V>;
    }

    export function wrapper<K, V>(nspace: IDStr,
                                  delegateName: CacheDelegateName | AggregateCacheDelegateNameTuple,
                                  wrapperName?: 'test-only'): IAsyncCacheWrapper<K, V> {

        const cache = AsyncCaches.create<K, V>(nspace, delegateName, wrapperName);

        const create: WrapperFactory<K, V> = (delegate) => {

            return async (input: K): Promise<V> => {

                if (await cache.containsKey(input)) {
                     const output = await cache.get(input);
                     return output!;
                }

                const output = await delegate(input);
                await cache.put(input, output);
                return output;

            }

        }

        return {create};

    }

}

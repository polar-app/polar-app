import {DiskBasedAsyncCacheDelegate} from "./delegates/DiskBasedAsyncCacheDelegate";
import {TestOnlyWrapper} from "./wrappers/TestOnlyWrapper";
import {FirestoreBasedAsyncCacheDelegate} from "./delegates/FirestoreBasedAsyncCacheDelegate";

export namespace AsyncCaches {

    export interface IAsyncCache<K, V> {
        readonly containsKey: (key: K) => Promise<boolean>
        readonly get: (key: K) => Promise<V | undefined>
        readonly put: (key: K, value: V) => Promise<void>
    }

    export function create<K, V>(delegateName: 'disk' | 'firestore', wrapperName?: 'test-only'): IAsyncCache<K, V> {

        function createDelegate() {

            switch(delegateName) {
                case "disk":
                    return DiskBasedAsyncCacheDelegate.create<K, V>();
                case "firestore":
                    return FirestoreBasedAsyncCacheDelegate.create<K, V>();

            }

        }

        const delegate = createDelegate();

        switch (wrapperName) {
            case 'test-only':
                return TestOnlyWrapper.create(delegate);
            default:
                return delegate;
        }

    }

}

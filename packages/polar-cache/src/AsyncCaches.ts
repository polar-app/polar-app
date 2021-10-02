import {DiskBasedAsyncCacheDelegate} from "./delegates/DiskBasedAsyncCacheDelegate";
import {TestOnlyWrapper} from "./wrappers/TestOnlyWrapper";

export namespace AsyncCaches {

    export interface IAsyncCache<K, V> {
        readonly containsKey: (key: K) => Promise<boolean>
        readonly get: (key: K) => Promise<V | undefined>
        readonly put: (key: K, value: V) => Promise<void>
    }

    export function create<K, V>(delegateName: 'disk', wrapperName?: 'test-only'): IAsyncCache<K, V> {

        function createDelegate() {
            return DiskBasedAsyncCacheDelegate.create<K, V>();
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

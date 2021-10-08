import {AsyncCacheDelegate} from "../AsyncCacheDelegate";

export namespace CacheDisabledWrapper {

    /**
     * Only allow the cache to be used during testing (karma, mocha)
     */
    export function create<K, V>(delegate: AsyncCacheDelegate<K, V>) {

        async function containsKey(key: K): Promise<boolean> {
            return false;
        }


        async function get(key: K): Promise<V | undefined> {
            return undefined;
        }

        async function put(key: K, value: V) {
        }

        return {containsKey, get, put};

    }

}

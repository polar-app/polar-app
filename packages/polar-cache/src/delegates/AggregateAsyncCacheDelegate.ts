import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {IDStr} from "polar-shared/src/util/Strings";

/**
 * Supports using multiple caches so that we can use local disk based caching, followed up by remote caching.
 */
export namespace AggregateAsyncCacheDelegate {

    export function create<K, V>(nspace: IDStr,
                                 primary: AsyncCacheDelegate<K, V>,
                                 secondary: AsyncCacheDelegate<K, V>): AsyncCacheDelegate<K, V> {

        async function containsKey(key: K): Promise<boolean> {

            if (await primary.containsKey(key)) {
                return true;
            }

            if (await secondary.containsKey(key)) {
                return true;
            }

            return false;

        }

        async function get(key: K): Promise<V | undefined> {

            if (await primary.containsKey(key)) {
                // we're done now because it's in the primary
                return await primary.get(key);
            }

            if (await secondary.containsKey(key)) {

                // we have to first fetch from the secondary
                const result = await secondary.get(key);

                if (result) {
                    // now we have to put it in the primary for next time.
                    await primary.put(key, result);
                }

                return result;

            }

            return undefined;

        }

        async function put(key: K, value: V) {

            // we must put this on BOTH backend caches
            await Promise.all([
                primary.put(key, value),
                secondary.put(key, value)
            ]);

        }

        return {containsKey, get, put};

    }

}

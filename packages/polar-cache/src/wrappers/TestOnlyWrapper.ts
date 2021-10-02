import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {Mocha} from "polar-shared/src/util/Mocha";

export namespace TestOnlyWrapper {

    /**
     * Only allow the cache to be used during testing (karma, mocha)
     */
    export function create<K, V>(delegate: AsyncCacheDelegate<K, V>) {

        function cacheDisabled() {
            return !Mocha.isMocha() && ! process.env.POLAR_CACHE_FORCED;
        }

        async function containsKey(key: K): Promise<boolean> {

            if (cacheDisabled()) {
                return false;
            }

            return await delegate.containsKey(key);

        }


        async function get(key: K): Promise<V | undefined> {

            if (cacheDisabled()) {
                return undefined;
            }

            return delegate.get(key);

        }

        async function put(key: K, value: V) {

            if (cacheDisabled()) {
                return;
            }

            return delegate.put(key, value);

        }

        return {containsKey, get, put};

    }

}

import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {Mocha} from "polar-shared/src/util/Mocha";

export namespace TestOnlyWrapper {

    /**
     * Only allow the cache to be used during testing (karma, mocha)
     */
    export function create<K, V>(delegate: AsyncCacheDelegate<K, V>) {

        async function containsKey(key: K): Promise<boolean> {

            if (!Mocha.isMocha()) {
                return false;
            }

            return await delegate.containsKey(key);

        }


        async function get(key: K): Promise<V | undefined> {

            if (!Mocha.isMocha()) {
                return undefined;
            }

            return delegate.get(key);

        }

        async function put(key: K, value: V) {

            if (!Mocha.isMocha()) {
                return;
            }

            return delegate.put(key, value);

        }

        return {containsKey, get, put};

    }

}

import {SnapshotCacheProvider} from "./SnapshotCacheProvider";
import {SnapshotCaches} from "./SnapshotCaches";
import {ISnapshotCachedDoc} from "./ISnapshotCachedDoc";

export namespace SnapshotCacheProviders {

    import SnapshotBacking = SnapshotCaches.SnapshotBacking;

    export function create(backing: SnapshotBacking): SnapshotCacheProvider {

        switch (backing) {

            case "none":
                return createNullSnapshotCacheProvider();
            case "localStorage":
                return createLocalStorageSnapshotCacheProvider();

        }

    }

    function createNullSnapshotCacheProvider(): SnapshotCacheProvider {

        async function purge() {
            // noop
        }

        async function write<V>(key: string, value: ISnapshotCachedDoc<V>) {
            // noop
        }

        async function remove(key: string) {
            // noop
        }

        async function read<V>(key: string): Promise<ISnapshotCachedDoc<V> | undefined> {
            return undefined;
        }

        return {purge, writeDoc: write, remove, readDoc: read};

    }

    function createLocalStorageSnapshotCacheProvider(): SnapshotCacheProvider {

        const prefix = 'snapshot-cache:';

        async function purge() {

            function computeKeys() {
                return Object.keys(localStorage).filter(current => current.startsWith(prefix));
            }

            for (const key of computeKeys()) {
                localStorage.removeItem(key);
            }

        }

        function createCacheKey(key: string) {
            return prefix + key;
        }

        async function write<V>(key: string, value: ISnapshotCachedDoc<V>) {
            const cacheKey = createCacheKey(key);
            localStorage.setItem(cacheKey, JSON.stringify(value));
        }

        async function remove(key: string) {
            const cacheKey = createCacheKey(key);
            localStorage.removeItem(cacheKey);
        }


        async function read<V>(key: string): Promise<ISnapshotCachedDoc<V> | undefined> {

            const cacheKey = createCacheKey(key);
            const item = localStorage.getItem(cacheKey);

            if (item === null) {
                return undefined;
            }

            return JSON.parse(item);

        }

        return {purge, writeDoc: write, remove, readDoc: read};

    }

}
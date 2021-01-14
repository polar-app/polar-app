import {CacheProvider} from "./CacheProvider";
import {StoreCaches} from "./StoreCaches";
import {ICachedDoc} from "./ICachedDoc";
import {ICachedQuery} from "./ICachedQuery";

export namespace CacheProviders {

    import SnapshotBacking = StoreCaches.SnapshotBacking;

    export function create(backing: SnapshotBacking): CacheProvider {

        switch (backing) {

            case "none":
                return createNullSnapshotCacheProvider();
            case "localStorage":
                return createLocalStorageSnapshotCacheProvider();

        }

    }

    function createNullSnapshotCacheProvider(): CacheProvider {

        async function purge() {
            // noop
        }

        async function writeDoc(key: string, value: ICachedDoc) {
            // noop
        }

        async function readDoc(key: string): Promise<ICachedDoc | undefined> {
            return undefined;
        }

        async function writeQuery(key: string, value: ICachedQuery) {
            // noop
        }

        async function readQuery(key: string): Promise<ICachedQuery | undefined> {
            return undefined;
        }


        async function remove(key: string) {
            // noop
        }


        return {purge, writeDoc, remove, readDoc, writeQuery, readQuery};

    }

    function createLocalStorageSnapshotCacheProvider(): CacheProvider {

        const prefix = 'snapshot-cache:';

        function createCacheKey(key: string) {
            return prefix + key;
        }

        async function write<V>(key: string, value: V) {
            try {
                const cacheKey = createCacheKey(key);
                localStorage.setItem(cacheKey, JSON.stringify(value));
            } catch (e) {
                console.error("Unable to write cache entry: ", e);
            }
        }


        async function read<V>(key: string): Promise<V | undefined> {

            try {

                const cacheKey = createCacheKey(key);
                const item = localStorage.getItem(cacheKey);

                if (item === null) {
                    return undefined;
                }

                return JSON.parse(item);

            } catch (e) {
                console.error("Unable to read cache entry: ", e);
                return undefined;
            }

        }
        async function writeDoc(key: string, value: ICachedDoc) {
            await write(key, value);
        }

        async function readDoc(key: string): Promise<ICachedDoc | undefined> {
            return await read(key);
        }


        async function writeQuery(key: string, value: ICachedQuery) {
            await write(key, value);
        }

        async function readQuery(key: string): Promise<ICachedQuery | undefined> {
            return await read(key);
        }

        async function remove(key: string) {
            const cacheKey = createCacheKey(key);
            localStorage.removeItem(cacheKey);
        }

        async function purge() {

            function computeKeys() {
                return Object.keys(localStorage).filter(current => current.startsWith(prefix));
            }

            for (const key of computeKeys()) {
                localStorage.removeItem(key);
            }

        }

        return {purge, writeDoc, remove, readDoc, writeQuery, readQuery};

    }

}
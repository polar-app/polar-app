import {FilePaths} from "polar-shared/src/util/FilePaths";
import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {IDStr, PathStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Files} from "polar-shared/src/util/Files";

export namespace DiskBasedAsyncCacheDelegate {

    const BASE_DIR = FilePaths.join(FilePaths.tmpdir(), 'polar-cache');

    export function create<K, V>(nspace: IDStr): AsyncCacheDelegate<K, V> {

        async function computePath(key: K): Promise<PathStr> {

            const hash = Hashcodes.create(key);

            const dir = FilePaths.join(BASE_DIR, nspace);

            if (! await Files.existsAsync(BASE_DIR)) {
                await Files.createDirAsync(BASE_DIR);
            }

            if (! await Files.existsAsync(dir)) {
                await Files.createDirAsync(dir);
            }

            return FilePaths.join(dir, `${hash}.data`);

        }

        async function containsKey(key: K): Promise<boolean> {

            const path = await computePath(key);

            return await Files.existsAsync(path);

        }

        async function get(key: K): Promise<V | undefined> {

            const path = await computePath(key);

            if(await containsKey(key)) {
                console.log("DiskBasedAsyncCacheDelegate: HIT: " + path);
                const data = await Files.readFileAsync(path)
                return JSON.parse(data.toString('utf-8'));
            }

            console.log("DiskBasedAsyncCacheDelegate: MISS: " + path);

            return undefined;

        }

        async function put(key: K, value: V) {

            const path = await computePath(key);
            await Files.writeFileAsync(path, JSON.stringify(value))

            console.log("DiskBasedAsyncCacheDelegate: PUT: " + path);

        }

        return {containsKey, get, put};

    }

}

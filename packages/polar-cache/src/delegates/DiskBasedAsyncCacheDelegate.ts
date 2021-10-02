import {FilePaths} from "polar-shared/src/util/FilePaths";
import {AsyncCacheDelegate} from "../AsyncCacheDelegate";
import {PathStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Files} from "polar-shared/src/util/Files";

export namespace DiskBasedAsyncCacheDelegate {

    const DIR = FilePaths.join(FilePaths.tmpdir(), 'polar-cache');

    export function create<K, V>(): AsyncCacheDelegate<K, V> {

        async function computePath(key: K): Promise<PathStr> {

            const hash = Hashcodes.create(key);

            if (! await Files.existsAsync(DIR)) {
                await Files.mkdirAsync(DIR);
            }

            return FilePaths.join(DIR, `${hash}.data`);

        }

        async function containsKey(key: K): Promise<boolean> {

            const path = await computePath(key);

            return await Files.existsAsync(path);

        }


        async function get(key: K): Promise<V | undefined> {

            if(await containsKey(key)) {
                const path = await computePath(key);
                console.log("DiskBasedAsyncCacheDelegate: HIT: " + path);
                const data = await Files.readFileAsync(path)
                return JSON.parse(data.toString('utf-8'));
            }

            return undefined;

        }

        async function put(key: K, value: V) {

            const path = await computePath(key);
            await Files.writeFileAsync(path, JSON.stringify(value))

            console.log("DiskBasedAsyncCacheDelegate: MISS (stored): " + path);

        }

        return {containsKey, get, put};

    }

}

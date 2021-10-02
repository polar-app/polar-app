import { Hashcodes } from "polar-shared/src/util/Hashcodes";
import {PathStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";
import {Mocha} from "polar-shared/src/util/Mocha";

/**
 * A very basic HTTP request cache, that works on disk, which is disabled when
 * not running in Mocha.
 *
 * Note that this isn't really optimized for speed, just to avoid OpenAI
 * calls.
 */
export namespace OpenAIRequestCache {

    const DIR = FilePaths.join(FilePaths.tmpdir(), 'openai-cache');

    export type Req =  Record<string, string | number | boolean>;
    export type Res = Req;

    export interface IOpenAIRequestCacheEntry {
        readonly url: string;
        readonly body: Req;
    }

    async function computePath(key: IOpenAIRequestCacheEntry): Promise<PathStr> {

        const hash = Hashcodes.create(key);

        if (! await Files.existsAsync(DIR)) {
            await Files.mkdirAsync(DIR);
        }

        return FilePaths.join(DIR, `${hash}.data`);

    }

    export async function contains(key: IOpenAIRequestCacheEntry): Promise<boolean> {

        if (!Mocha.isMocha()) {
            return false;
        }

        const path = await computePath(key);

        return await Files.existsAsync(path);

    }


    export async function get(key: IOpenAIRequestCacheEntry): Promise<Res | undefined> {

        if ( ! Mocha.isMocha()) {
            return undefined;
        }

        if(await contains(key)) {
            const path = await computePath(key);
            console.log("OpenAIRequestCache: HIT: " + path);
            const data = await Files.readFileAsync(path)
            return JSON.parse(data.toString('utf-8'));
        }

        return undefined;

    }

    export async function set(key: IOpenAIRequestCacheEntry, response: Res) {

        if ( ! Mocha.isMocha()) {
            return;
        }

        const path = await computePath(key);
        await Files.writeFileAsync(path, JSON.stringify(response))

        console.log("OpenAIRequestCache: MISS (stored): " + path);

    }

}

import { Hashcodes } from "polar-shared/src/util/Hashcodes";
import {PathStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";

export namespace OpenAIRequestCache {

    const DIR = FilePaths.join(FilePaths.tmpdir(), 'openai-cache');

    export interface IOpenAIRequestCacheEntry {
        readonly url: string;
        readonly body: Record<string, any>;
    }

    async function computePath(key: IOpenAIRequestCacheEntry): Promise<PathStr> {

        const hash = Hashcodes.createHashcode(key);

        if (! await Files.existsAsync(DIR)) {
            await Files.mkdirAsync(DIR);
        }

        return FilePaths.join(DIR, `${hash}.data`);

    }

    export async function get(key: IOpenAIRequestCacheEntry) {

        const path = await computePath(key);

        if (await Files.existsAsync(path)) {
            const data = await Files.readFileAsync(path)
            return JSON.parse(data.toString('utf-8'));
        }

    }

    export async function set(key: IOpenAIRequestCacheEntry, response: Record<string, any>) {
        const path = await computePath(key);
        await Files.writeFileAsync(path, JSON.stringify(response))
    }


}

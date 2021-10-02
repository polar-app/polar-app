import {AsyncCaches} from "polar-cache/src/AsyncCaches";

/**
 * A very basic HTTP request cache, that works on disk, which is disabled when
 * not running in Mocha.
 *
 * Note that this isn't really optimized for speed, just to avoid OpenAI
 * calls.
 */
export namespace OpenAIRequestsCache {

    export type Req =  Record<string, string | number | boolean>;
    export type Res = Req;

    export interface IOpenAIRequestCacheKey {
        readonly url: string;
        readonly body: Req;
    }

    export function create() {
        return AsyncCaches.create<IOpenAIRequestCacheKey, Res>('firestore', 'test-only');
    }

}

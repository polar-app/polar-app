import {AsyncCaches} from "polar-cache/src/AsyncCaches";

/**
 */
export namespace OpenAIRequestsCache {

    export type Req =  Record<string, unknown>;
    export type Res = Req;

    export interface IOpenAIRequestCacheKey {
        readonly url: string;
        readonly body: any;
    }

    export function create() {
        return AsyncCaches.create<IOpenAIRequestCacheKey, Res>('answers-openai-requests', 'firestore', 'test-only');
    }

}

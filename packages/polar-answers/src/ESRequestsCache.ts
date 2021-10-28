import {AsyncCaches} from "polar-cache/src/AsyncCaches";

/**
 */
export namespace ESRequestsCache {

    export type Req =  Record<string, unknown>;
    export type Res = Req;

    export interface IESRequestCacheKey {
        readonly url: string;
        readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        readonly body: Req;
        readonly credentialsHash: string;
    }

    export function create() {
        return AsyncCaches.create<IESRequestCacheKey, Res>('answers-es-requests', ['disk', 'google-cloud-storage'], 'test-only');
    }

}

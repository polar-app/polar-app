import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";
import {ESSecrets} from "./ESSecrets";
import {ESRequestsCache} from "./ESRequestsCache";
import * as crypto from 'crypto';

export namespace ESRequests {

    const cache = ESRequestsCache.create();

    import IESRequestCacheKey = ESRequestsCache.IESRequestCacheKey;

    export interface IElasticResponse<T> {
        readonly _source: T;
        readonly _score: number;
    }

    export interface IElasticSearchHitsTotal {
        readonly value: number;
    }

    export interface IElasticSearchHits<T> {
        readonly total: IElasticSearchHitsTotal;
        readonly hits: ReadonlyArray<IElasticResponse<T>>;
    }

    export interface IElasticSearchResponse<T> {
        /**
         * The duration of this request.
         */
        readonly took: number;
        readonly hits: IElasticSearchHits<T>;
    }

    async function doRequest(url: string, method: 'PUT' | 'GET' | 'POST' | 'DELETE', body: Record<string, unknown> | undefined) {

        ESSecrets.init();

        const esCredentials = ESCredentials.get();

        const authorization = Buffer.from(`${esCredentials.user}:${esCredentials.pass}`).toString('base64');

        // Make sure changes to ES credentials produce a "cache miss"
        const credentialsHash = crypto
            .createHash("sha256")
            .update(JSON.stringify(esCredentials), "binary")
            .digest("base64");

        const cacheKey: IESRequestCacheKey = {
            url,
            body: body || {},
            method,
            credentialsHash,
        }

        if (await cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        const response = await Fetches.fetch(`${esCredentials.endpoint}${url}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {

            const result = await response.json()

            await cache.put(cacheKey, result);

            return result;

        }

        throw new Error(`${method} to ${url} failed: ${response.status}: ${response.statusText}`);

    }

    export async function doPut(url: string, body: any) {
        return await doRequest(url, 'PUT', body);
    }

    export async function doPost(url: string, body: any) {
        return await doRequest(url, 'POST', body);
    }


    export async function doGet(url: string): Promise<any> {
        return await doRequest(url, 'GET', undefined);
    }

    export async function doDelete(url: string): Promise<any> {
        return await doRequest(url, 'DELETE', undefined);
    }

}

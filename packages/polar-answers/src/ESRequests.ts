import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";
import {ESSecrets} from "./ESSecrets";
import {ESRequestsCache} from "./ESRequestsCache";

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

    export async function doPut(url: string, body: any) {

        ESSecrets.init();

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`PUT to ${url} failed: ${response.status}: ${response.statusText}`);

    }

    async function doRequest(url: string, method: 'PUT' | 'GET' | 'POST', body: Record<string, unknown> | undefined) {

        ESSecrets.init();

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const cacheKey: IESRequestCacheKey = {
            url,
            body: body || {},
            method: 'PUT'
        }

        if (await cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'POST',
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

    export async function doPost(url: string, body: any) {
        return await doRequest(url, 'POST', body);
    }


    export async function doGet(url: string): Promise<any> {
        return await doRequest(url, 'GET', undefined);
    }

}

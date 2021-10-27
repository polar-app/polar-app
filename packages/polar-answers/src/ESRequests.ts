import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";
import {ESSecrets} from "./ESSecrets";
import {ESRequestsCache} from "./ESRequestsCache";

export type EsProvider = "elastic.co" | "aws-elasticsearch";

class EsProvidersAdapter {
    private credentials?: ESCredentials.IESCredentials;

    constructor() {
        ESSecrets.init();

        // Set the provider to be elastic.co by default for now (until we are confident enough in AWS ES)
        this.reset();
    }

    switchTo(provider: EsProvider) {
        switch (provider) {
            case "elastic.co":
                this.reset();
                break;
            case "aws-elasticsearch":
                this.credentials = {
                    endpoint: 'https://search-polar-m-elasti-7da1alsug7eb-ark26m65fe3ke5q4xpbl647jfa.us-east-1.es.amazonaws.com',
                    user: 'admin',
                    pass: 'IW+,5H7,0B;Zbc$vJg4Q/-6t1Sje_J2H',
                };
                break;
            default:
                throw new Error(`Can not switch to unsupported ElasticSearch provider: ${provider}`);
        }
    }

    getCredentials(): ESCredentials.IESCredentials {
        return this.credentials!;
    }

    private reset() {
        this.credentials = ESCredentials.get();
    }
}

export namespace ESRequests {

    const cache = ESRequestsCache.create();

    /**
     * Allow to easily switch between ElasticSearch providers by calling EsRequests.provider.switchTo(provider);
     * The change is reflected in any subsequent ES calls
     */
    export const provider = new EsProvidersAdapter();

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

        const esCredentials = provider.getCredentials();

        const authorization = Buffer.from(`${esCredentials.user}:${esCredentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${esCredentials.endpoint}${url}`, {
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

    async function doRequest(url: string, method: 'PUT' | 'GET' | 'POST' | 'DELETE', body: Record<string, unknown> | undefined) {

        const esCredentials = provider.getCredentials();

        const authorization = Buffer.from(`${esCredentials.user}:${esCredentials.pass}`).toString('base64');

        const cacheKey: IESRequestCacheKey = {
            url,
            body: body || {},
            method: 'PUT'
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

import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";
import {ESSecrets} from "./ESSecrets";
import {IElasticsearchQuery} from "polar-answers-api/src/IElasticsearchQuery";

export namespace ESRequests {

    export interface IElasticResponse<T> {
        readonly _source: T;
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

    export async function doPut(url: string, body: object) {

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

    export async function doPost(url: string, body: Record<string, unknown> | string | IElasticsearchQuery) {

        ESSecrets.init();

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'POST',
            body: typeof body === 'string' ? body : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`POST to ${url} failed: ${response.status}: ${response.statusText}`);

    }
    export async function doGet(url: string): Promise<any> {

        ESSecrets.init();

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Invalid response: ${response.status}: ${response.statusText}`);

    }

}

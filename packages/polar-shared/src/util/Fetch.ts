import {Request, Response, BodyInit} from 'node-fetch';
// eslint-disable-next-line camelcase
import {default as node_fetch} from 'node-fetch';
import {Optional} from "./ts/Optional";
import { ProgressListener } from './ProgressTracker';

declare var window: any;

/**
 * Implementation of fetch which uses node-fetch when running in node or
 * window.fetch when running in the Browser.  We can also mock it to test the
 * implementation directly without needing a backend server to implement the
 * methods.
 */
function fetchDelegate(url: string | Request, init?: RequestInit): Promise<Response> {

    if (MockFetch.response) {
        return Promise.resolve(MockFetch.response);
    }

    if (typeof window !== 'undefined' && window.fetch) {
        // we're running in the browser so take that route
        return window.fetch(url, init);
    }

    // we're running in node so use node_fetch.
    return node_fetch(url, init);

}

export class MockFetch {

    /**
     * When defined, we use this as a mock response and return it directly.
     */
    public static response?: Response;

}

// we have to use a custom RequestInit to be compatible with node_fetch and window.fetch
export interface RequestInit {
    readonly body?: BodyInit;
    readonly cache?: RequestCache;
    readonly credentials?: RequestCredentials;
    readonly headers?: {readonly [key: string]: string};
    readonly integrity?: string;
    readonly keepalive?: boolean;
    readonly method?: string;
    readonly mode?: RequestMode;
    readonly redirect?: RequestRedirect;
    readonly referrer?: string;
    readonly referrerPolicy?: ReferrerPolicy;
    // signal?: AbortSignal | null;
    readonly window?: any;
}

export class Fetches {

    /**
     * Syntactic sugar so we can call this easier using auto-completion.
     */
    public static async fetch(url: string | Request, init?: RequestInit): Promise<Response> {

        const response = await fetchDelegate(url, init);

        const contentLength =
            Optional.of(response.headers.get('content-length'))
                .map(value => parseInt(value))
                .getOrUndefined();

        if (contentLength) {

        }

        return response;
    }

}

export class Responses {

    public static toProgressStream(stream: NodeJS.ReadableStream, listener: ProgressListener) {


    }

}

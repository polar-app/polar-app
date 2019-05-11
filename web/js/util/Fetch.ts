import {Request, Response, RequestInit} from 'node-fetch';

import {default as node_fetch} from 'node-fetch';

declare var window: any;

/**
 * Implementation of fetch which uses node-fetch when running in node or
 * window.fetch when running in the Browser.  We can also mock it to test the
 * implementation directly without needing a backend server to implement the
 * methods.
 */
export default function fetch(url: string | Request, init?: RequestInit): Promise<Response> {

    if (MockFetch.response) {
        return Promise.resolve(MockFetch.response);
    }

    if (typeof window !== 'undefined' && window.fetch) {
        return window.fetch(url, init);
    }

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
    body?: string ;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    headers?: {[key: string]: string};
    integrity?: string;
    keepalive?: boolean;
    method?: string;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal | null;
    window?: any;
}
